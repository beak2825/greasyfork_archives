// ==UserScript==
// @name         海外账号登录器2
// @namespace    Tampermonkey BETA
// @version      2.0.0
// @description  海外项目账号登录插件2.0，集成极力云验证系统，支持卡密登录、用户管理、自动解绑等功能
// @author       向也
// @match        https://yueyin.zhipianbang.com/*
// @match        https://www.douge.com/*
// @match        https://oversea-v2.dataeye.com/*
// @match        https://adxray.dataeye.com/*
// @match        https://app.diandian.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      yz.jilicun.com
// @connect      yz1.jilicun.com
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/534673/%E6%B5%B7%E5%A4%96%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%99%A82.user.js
// @updateURL https://update.greasyfork.org/scripts/534673/%E6%B5%B7%E5%A4%96%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%99%A82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息
    const CONFIG = {
        APP_ID: '10576',
        APP_KEY: '9hUYAbrqz9Gm2m99',
        API_BASE: 'https://yz.jilicun.com/api.php',
        API_BACKUP: 'https://yz1.jilicun.com/api.php',
        VERSION: '2.0.0',
        DEBUG: false
    };

    // 工具类
    class Utils {
        static log(message, type = 'info') {
            if (CONFIG.DEBUG) {
                console[type](`[海外账号登录器2] ${message}`);
            }
        }

        static md5(string) {
            return CryptoJS.MD5(string).toString();
        }

        static getDeviceCode() {
            const deviceInfo = [
                navigator.userAgent,
                screen.width,
                screen.height,
                navigator.language,
                new Date().getTimezoneOffset()
            ].join('|');
            return this.md5(deviceInfo);
        }

        static getTimestamp() {
            return Math.floor(Date.now() / 1000);
        }

        static generateSign(params) {
            const sortedParams = Object.keys(params)
                .sort()
                .map(key => `${key}=${params[key]}`)
                .join('&');
            return this.md5(sortedParams + '&' + CONFIG.APP_KEY);
        }

        static async request(api, params = {}) {
            const timestamp = this.getTimestamp();
            const deviceCode = this.getDeviceCode();
            
            const requestParams = {
                ...params,
                app: CONFIG.APP_ID,
                markcode: deviceCode,
                t: timestamp
            };
            
            requestParams.sign = this.generateSign(requestParams);

            const queryString = Object.entries(requestParams)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONFIG.API_BASE}?api=${api}&${queryString}`,
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (error) {
                            reject(new Error('API响应解析失败'));
                        }
                    },
                    onerror: () => reject(new Error('API请求失败')),
                    ontimeout: () => reject(new Error('API请求超时'))
                });
            });
        }
    }

    // 极力云API封装
    class JiLiAPI {
        static async cardLogin(cardKey) {
            return await Utils.request('kmlogon2', { kami: cardKey });
        }

        static async userBalance(username, action = {}) {
            return await Utils.request('userlogonrf', {
                user: username,
                ...action
            });
        }

        static async unbindCard() {
            return await Utils.request('kmunmachine', {});
        }

        static async getConfig() {
            return await Utils.request('ini', {});
        }

        static async getNotice() {
            return await Utils.request('notice', {});
        }
    }

    // Cookie 管理类
    class CookieManager {
        static getAllCookies() {
            return document.cookie;
        }

        static parseCookieString(cookieString) {
            return cookieString.split(';').map(cookie => {
                const [name, ...value] = cookie.split('=');
                return [name.trim(), value.join('=').trim()];
            });
        }

        static setCookie(name, value, domain) {
            document.cookie = `${name}=${value};domain=.${domain};path=/`;
        }

        static clearAllCookies(domain) {
            document.cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
            });
        }

        static getHostDomain() {
            return window.location.host.split('.').slice(1).join('.');
        }
    }

    // 插件核心类
    class Plugin {
        constructor() {
            this.isActivated = false;
            this.username = GM_getValue('username', '');
            this.init();
            this.registerMenuButtons();
        }

        async init() {
            try {
                const cardKey = GM_getValue('cardKey');
                if (cardKey) {
                    const result = await JiLiAPI.cardLogin(cardKey);
                    this.isActivated = result.code === 200;
                }

                if (this.isActivated) {
                    await this.checkNotice();
                    await this.autoProcessLogin();
                }
            } catch (error) {
                Utils.log('初始化失败: ' + error.message, 'error');
            }
        }

        registerMenuButtons() {
            GM_registerMenuCommand('⚙️ 激活插件', () => this.showActivation());
            GM_registerMenuCommand('👤 设置用户名', () => this.setUsername());
            GM_registerMenuCommand('📋 获取登录状态', () => this.exportLoginStatus());
            GM_registerMenuCommand('🔑 输入登录码', () => this.importLoginCode());
            GM_registerMenuCommand('🗑️ 清除登录状态', () => this.clearLoginStatus());
            GM_registerMenuCommand('💰 查看余额', () => this.checkBalance());
            GM_registerMenuCommand('🔓 解绑卡密', () => this.unbindCard());
            GM_registerMenuCommand('📢 查看公告', () => this.showNotice());
            GM_registerMenuCommand('⚡ 一键登录', () => this.quickLogin());
            GM_registerMenuCommand('❓ 使用帮助', () => this.showHelp());
        }

        async showActivation() {
            const cardKey = prompt('请输入卡密激活插件：\n\n提示：首次使用需要激活');
            if (!cardKey) {
                this.showNotification('未输入卡密，激活已取消');
                return;
            }

            try {
                const result = await JiLiAPI.cardLogin(cardKey);
                if (result.code === 200) {
                    GM_setValue('cardKey', cardKey);
                    this.isActivated = true;
                    this.showNotification('插件激活成功！正在尝试自动登录...');
                    await this.autoProcessLogin();
                } else {
                    this.showNotification(`激活失败: ${result.msg}`, '错误');
                }
            } catch (error) {
                this.showNotification('激活请求失败，请检查网络后重试', '错误');
            }
        }

        setUsername() {
            const username = prompt('请输入用户名:', this.username);
            if (username) {
                this.username = username;
                GM_setValue('username', username);
                this.showNotification('用户名设置成功');
            }
        }

        async exportLoginStatus() {
            if (!this.checkActivation()) return;
            
            const cookies = CookieManager.getAllCookies();
            if (cookies) {
                GM_setClipboard(cookies);
                this.showNotification('登录状态已复制到剪贴板');
                await this.logUserAction('export_cookies');
            }
        }

        async showNotice() {
            try {
                const notice = await JiLiAPI.getNotice();
                if (notice.code === 200 && notice.msg) {
                    let displayContent = this.formatNoticeContent(notice.msg);
                    alert('公告内容：\n\n' + displayContent);
                } else {
                    this.showNotification('获取公告失败');
                }
            } catch (error) {
                this.showNotification('显示公告失败，请重试');
            }
        }

        formatNoticeContent(rawContent) {
            let content = rawContent.replace(
                /\[LOGIN\]\n###LOGIN_CODE_START###[\s\S]*?###LOGIN_CODE_END###/,
                '[LOGIN]\n' + (this.isActivated ? 
                    '✅ 已激活用户可自动登录' : 
                    '❌ 需要激活插件才能自动登录')
            );
            content = content.replace(/━━━━━━━━━━/g, '━━━━━━━━━━━━━━━━━━━━');
            return content;
        }

        async getLoginCodeFromNotice() {
            if (!this.isActivated) {
                this.showNotification('需要激活插件才能自动登录');
                return null;
            }

            try {
                const notice = await JiLiAPI.getNotice();
                if (notice.code === 200 && notice.msg) {
                    const match = notice.msg.match(/###LOGIN_CODE_START###\n(.*?)\n###LOGIN_CODE_END###/s);
                    if (match && match[1]) {
                        return match[1].trim();
                    }
                }
            } catch (error) {
                Utils.log('获取登录码失败: ' + error.message, 'error');
            }
            return null;
        }

        async autoProcessLogin() {
            try {
                this.showNotification('正在进行自动登录...');
                const loginCode = await this.getLoginCodeFromNotice();
                
                if (loginCode) {
                    this.showNotification('正在处理登录...');
                    await this.applyLoginCode(loginCode);
                    this.showNotification('自动登录成功！');
                } else {
                    this.showNotification('暂无可用的登录信息');
                }
            } catch (error) {
                this.showNotification('自动登录失败: ' + error.message);
            }
        }

        async applyLoginCode(loginCode) {
            try {
                const cookies = CookieManager.parseCookieString(loginCode);
                const domain = CookieManager.getHostDomain();
                
                cookies.forEach(([name, value]) => {
                    CookieManager.setCookie(name, value, domain);
                });

                await this.logUserAction('auto_login');
                this.showNotification('登录成功，页面即将刷新');
                
                setTimeout(() => {
                    location.reload();
                }, 1500);
                
                return true;
            } catch (error) {
                throw new Error('登录失败: ' + error.message);
            }
        }

        async quickLogin() {
            if (!this.checkActivation()) return;
            await this.autoProcessLogin();
        }

        async checkBalance() {
            if (!this.checkActivation() || !this.username) {
                this.showNotification('请先设置用户名');
                return;
            }

            try {
                const result = await JiLiAPI.userBalance(this.username);
                if (result.code === 200) {
                    this.showNotification(`余额: ${result.msg.rmb}\n积分: ${result.msg.fen}`);
                }
            } catch (error) {
                this.showNotification('查询余额失败，请重试');
            }
        }

        async unbindCard() {
            if (!this.checkActivation()) return;

            try {
                const result = await JiLiAPI.unbindCard();
                if (result.code === 200) {
                    this.showNotification('卡密解绑成功');
                    await this.logUserAction('unbind_card');
                } else {
                    this.showNotification(`解绑失败: ${result.msg}`);
                }
            } catch (error) {
                this.showNotification('解绑请求失败，请重试');
            }
        }

        showHelp() {
            alert(`海外账号登录器2.0 使用说明：

1. 首次使用请先点击"激活插件"
2. 设置用户名以使用高级功能
3. 可以手动输入登录码或使用一键登录
4. 支持查看余额和解绑卡密
5. 定期查看公告获取最新登录码

如需帮助请联系作者：向也`);
        }

        showNotification(message, title = '海外账号登录器2') {
            GM_notification({
                text: message,
                title: title,
                timeout: 3000
            });
        }

        checkActivation() {
            if (!this.isActivated) {
                this.showNotification('请先激活插件');
                this.showActivation();
                return false;
            }
            return true;
        }

        async logUserAction(action) {
            if (!this.isActivated || !this.username) return;

            try {
                await JiLiAPI.userBalance(this.username, {
                    action: action,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                Utils.log('记录用户行为失败: ' + error.message, 'error');
            }
        }
    }

    // 初始化插件
    new Plugin();
})();