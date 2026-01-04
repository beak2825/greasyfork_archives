// ==UserScript==
// @name         网站论坛自动签到脚本
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  合并多个网站的自动签到脚本，代码结构优化，配置集中，Hook更安全。
// @author       Riki
// @license      CC-BY-4.0
// @grant        none
// @match        https://interact.jd.com/*
// @match        https://bbs.steamtools.net/*
// @match        https://caigamer.cn/*
// @match        https://www.nesbbs.com/bbs/*
// @match        https://www.tekqart.com/*
// @downloadURL https://update.greasyfork.org/scripts/541247/%E7%BD%91%E7%AB%99%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541247/%E7%BD%91%E7%AB%99%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        LOG_PREFIX: '[AutoSign]',
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 800, // 稍微增加重试间隔，减少被由于点击过快被判定机器人的风险
        POLL_INTERVAL: 500,
        ELEMENT_TIMEOUT: 15000, // 30s有点太长，15s通常足够
        POPUP_TIMEOUT: 15000,
        HOOK_TIMEOUT: 10000,
        REDIRECT_DELAY: 1500
    };

    // === 工具函数模块 ===
    const Utils = {
        log(site, message, type = 'info') {
            const logFunc = console[type] || console.log;
            const color = type === 'error' ? 'red' : (type === 'warn' ? 'orange' : '#2196F3');
            console.log(`%c${CONFIG.LOG_PREFIX} [${site}]`, `color: ${color}; font-weight: bold`, message);
        },

        getTodayStr() {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        },

        isSignedToday(storageKey) {
            try {
                return localStorage.getItem(storageKey) === this.getTodayStr();
            } catch (e) {
                console.error('读取存储失败:', e);
                return false;
            }
        },

        recordSignIn(storageKey) {
            try {
                localStorage.setItem(storageKey, this.getTodayStr());
            } catch (e) {
                console.error('保存存储失败:', e);
            }
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        waitForElement(selector, timeout = CONFIG.ELEMENT_TIMEOUT) {
            return new Promise((resolve, reject) => {
                const immediateEl = document.querySelector(selector);
                if (immediateEl) return resolve(immediateEl);

                // 如果body还没加载，直接MutationObserver会报错，虽然外层有DOMContentLoaded，加一层保险
                if (!document.body) {
                    return reject(new Error('Document body not ready'));
                }

                let timer = null;
                const observer = new MutationObserver((mutations, obs) => {
                    const targetEl = document.querySelector(selector);
                    if (targetEl) {
                        clearTimeout(timer);
                        obs.disconnect();
                        resolve(targetEl);
                    }
                });

                timer = setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`等待元素超时: ${selector}`));
                }, timeout);

                observer.observe(document.body, { childList: true, subtree: true });
            });
        },

        async clickWithRetry(element, siteName) {
            for (let i = 0; i < CONFIG.RETRY_ATTEMPTS; i++) {
                try {
                    if (element && (typeof element.click === 'function' || element instanceof HTMLElement)) {
                        element.click();
                        return true;
                    }
                    throw new Error('元素无效或不可点击');
                } catch (e) {
                    this.log(siteName, `点击失败 (${i + 1}/${CONFIG.RETRY_ATTEMPTS}): ${e.message}`, 'warn');
                    if (i < CONFIG.RETRY_ATTEMPTS - 1) await this.sleep(CONFIG.RETRY_DELAY);
                }
            }
            return false;
        }
    };

    // === 签到处理器基类 ===
    class SignInHandler {
        constructor(siteName, storageKey) {
            this.siteName = siteName;
            this.storageKey = storageKey;
        }

        async run() {
            Utils.log(this.siteName, '脚本启动检测...');
            if (Utils.isSignedToday(this.storageKey)) {
                Utils.log(this.siteName, '✅ 缓存记录显示今天已签到，跳过执行。');
                return;
            }
            try {
                await this.handle();
            } catch (error) {
                // 忽略超时错误，避免控制台太红，普通超时视为未找到签到入口
                if (error.message && error.message.includes('超时')) {
                    Utils.log(this.siteName, '未检测到签到入口或操作超时 (可能是已签到或页面结构变更)', 'warn');
                } else {
                    Utils.log(this.siteName, `执行异常: ${error.message}`, 'error');
                }
            }
        }

        async handle() { throw new Error('子类必须实现 handle 方法'); }

        recordSuccess() {
            Utils.recordSignIn(this.storageKey);
            Utils.log(this.siteName, '🎉 签到成功并已记录!');
        }
    }

    // === 1. 京东 ===
    class JDSignInHandler extends SignInHandler {
        constructor() { super('京东', 'jd_interact_sign_date'); }
        async handle() {
            // JD的选择器比较宽泛，增加一个父级限定更安全
            const acceptBtn = await Utils.waitForElement('div.btn img[src*="360buyimg.com"]', 5000)
                .then(img => img.closest('div.btn'));
            
            Utils.log(this.siteName, '检测到签到按钮，正在点击...');
            if (await Utils.clickWithRetry(acceptBtn, this.siteName)) {
                this.processSuccessPopup();
            }
        }
        processSuccessPopup() {
            Utils.waitForElement('div.success', CONFIG.HOOK_TIMEOUT)
                .then(() => this.recordSuccess())
                .catch(() => Utils.log(this.siteName, '未检测到成功弹窗，但点击已执行', 'warn'));
        }
    }

    // === 2. SteamTools (Discuz! 深度修改版) ===
    class SteamToolsSignInHandler extends SignInHandler {
        constructor() { super('SteamTools', 'steamtools_last_sign_date_v2'); }
        async handle() {
            this.installHook();
            // 先找按钮，确保页面加载完毕
            try {
                 await Utils.waitForElement('a.sign.img_big', 5000);
            } catch(e) {
                 // 忽略找不到按钮，可能是已签到状态的页面
            }

            // 直接尝试调用 JS
            if (typeof window.showWindow === 'function') {
                Utils.log(this.siteName, '调用 showWindow 触发签到...');
                window.showWindow('sign', 'plugin.php?id=dc_signin:sign');
                this.processPopup();
            } else {
                Utils.log(this.siteName, '未找到 showWindow 函数', 'error');
            }
        }

        processPopup() {
            // 处理后续弹窗逻辑
            const checkPopup = setInterval(() => {
                const popup = document.getElementById('fwin_content_sign');
                if (!popup) return;

                // Case 1: 已经签到过
                if (popup.textContent.includes('您今日已经签过到') || popup.textContent.includes('已签到')) {
                    Utils.log(this.siteName, '检测到“已签到”提示。');
                    this.recordSuccess();
                    clearInterval(checkPopup);
                    if(typeof window.hideWindow === 'function') window.hideWindow('sign');
                    return;
                }

                // Case 2: 需要选心情
                const mood = popup.querySelector('.dcsignin_list li');
                const confirmBtn = [...popup.querySelectorAll('button')].find(b => b.textContent.includes('确定'));
                
                if (mood && confirmBtn) {
                    Utils.log(this.siteName, '执行选心情签到...');
                    mood.click();
                    setTimeout(() => confirmBtn.click(), 300);
                    clearInterval(checkPopup);
                }
            }, 500);
            setTimeout(() => clearInterval(checkPopup), CONFIG.POPUP_TIMEOUT);
        }

        installHook() {
            // Hook 成功回调，用于精确记录
            let attempts = 0;
            const hookTimer = setInterval(() => {
                if (typeof window.succeedhandle_signin === 'function') {
                    clearInterval(hookTimer);
                    const original = window.succeedhandle_signin;
                    // 防止重复Hook
                    if (original.name !== 'hookedSuccess') {
                         window.succeedhandle_signin = function hookedSuccess(href, message, param) {
                            Utils.log('SteamTools', '捕捉到成功回调!');
                            new SteamToolsSignInHandler().recordSuccess(); // 静态调用或重新实例化记录
                            return original.apply(this, arguments);
                        };
                    }
                }
                if (++attempts > 20) clearInterval(hookTimer);
            }, 500);
        }
    }

    // === 3. 菜Gamer ===
    class CaiGamerSignInHandler extends SignInHandler {
        constructor() { super('菜Gamer', 'caigamer_sign_date'); }
        async handle() {
            const signLink = await Utils.waitForElement('#sg_sign');
            // 检查 data 属性
            if (signLink.getAttribute('data-is_checked') == '1' || signLink.textContent.includes('已签到')) {
                 Utils.log(this.siteName, '状态检测: 已签到');
                 this.recordSuccess();
                 return;
            }
            
            Utils.log(this.siteName, '点击签到...');
            if (await Utils.clickWithRetry(signLink, this.siteName)) {
                // 菜Gamer 签到后通常会变成 "已签到" 文字，等待这个变化
                setTimeout(() => {
                    if(signLink.textContent.includes('已') || signLink.getAttribute('data-is_checked') == '1') {
                        this.recordSuccess();
                    }
                }, 1000);
            }
        }
    }

    // === 4. NESBBS ===
    class NesbbsSignInHandler extends SignInHandler {
        constructor() { super('NESBBS', 'nesbbs_sign_date'); }
        async handle() {
            // 查找包含 showWindow('dsu_paulsign' 的链接
            const signLink = await Utils.waitForElement('a[onclick*="dsu_paulsign"]');
            if(signLink.textContent.includes('已签到')) {
                 this.recordSuccess();
                 return;
            }

            Utils.log(this.siteName, '打开签到面板...');
            signLink.click();

            // 等待面板出现
            const popup = await Utils.waitForElement('#fwin_content_dsu_paulsign');
            
            // 稍微等待渲染
            await Utils.sleep(500); 

            const mood = popup.querySelector('ul.qdsmilea li');
            const modeRadio = popup.querySelector('input[name="qdmode"][value="3"]'); // 比如"自己填写"或其他模式
            const btn = popup.querySelector('button[name="qdbutton"]'); // 通常按钮有这个name

            if (mood && modeRadio && btn) {
                Utils.log(this.siteName, '填写表单并提交...');
                mood.click();
                modeRadio.checked = true;
                btn.click();
                this.recordSuccess();
            } else {
                Utils.log(this.siteName, '未找到完整的表单元素', 'error');
            }
        }
    }

    // === 5. Tekqart ===
    class TekqartSignInHandler extends SignInHandler {
        constructor() { super('Tekqart', 'tekqart_last_sign_date'); }
        async handle() {
            const { pathname, search } = window.location;
            
            // 路由策略
            if (pathname === '/' || pathname.includes('forum.php') || pathname.includes('index.php')) {
                const link = document.querySelector('a[href*="id=zqlj_sign"]');
                if (link) {
                    Utils.log(this.siteName, '主页: 跳转至签到页...');
                    window.location.href = link.href;
                }
            } else if (search.includes('id=zqlj_sign')) {
                // 在签到页面
                const btn = await Utils.waitForElement('.signbtn .btna', 3000);
                Utils.log(this.siteName, '点击打卡...');
                if (await Utils.clickWithRetry(btn, this.siteName)) {
                    this.recordSuccess();
                    Utils.log(this.siteName, '2秒后返回首页...');
                    setTimeout(() => window.location.href = './', 2000);
                }
            }
        }
    }

    // === 主程序入口 ===
    const ROUTER = {
        'jd.com': JDSignInHandler,
        'steamtools.net': SteamToolsSignInHandler,
        'caigamer.cn': CaiGamerSignInHandler,
        'nesbbs.com': NesbbsSignInHandler,
        'tekqart.com': TekqartSignInHandler
    };

    const runScript = () => {
        const host = window.location.hostname;
        for (const domain in ROUTER) {
            if (host.includes(domain)) {
                try {
                    const handler = new ROUTER[domain]();
                    handler.run();
                } catch (e) {
                    console.error(`${CONFIG.LOG_PREFIX} 初始化错误:`, e);
                }
                break;
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runScript);
    } else {
        runScript();
    }

})();