// ==UserScript==
// @name         自动签到助手
// @version      0.9.3
// @description  自动签到 ACG论坛 + 嗶咔漫畫 + MT论坛 + 远景论坛 + 鱼C + 52破解 + 55188 + AnyWlan 等
// @author       Crayon
// @match        *://acgfun.pro/*
// @match        *://manhuabika.com/puser/*
// @match        *://*.binmt.cc/*
// @match        *://*.pcbeta.com/*
// @match        *://fishc.com.cn/*
// @match        *://bbs.kafan.cn/*
// @match        *://*.52pojie.cn/*
// @match        *://*.55188.com/*
// @match        *://*.anywlan.com/*
// @grant        none
// @license      MIT
// @icon         none
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1249027
// @downloadURL https://update.greasyfork.org/scripts/541772/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541772/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 1. 核心工具模块
    // ==========================================
    const Utils = {
        // 检查是否为阻断页面（登录/验证/发帖/回复页）
        isBlockPage: () => {
            const keywords = [
                "member.php", "logging", "login", "register", "auth", "signin", "verify", 
                "action=reply", "action=post", "action=edit", "mod=post"
            ];
            return keywords.some(k => location.href.toLowerCase().includes(k));
        },
        
        getToday: () => new Date().toDateString(),
        
        isSigned: (key) => localStorage.getItem(key) === Utils.getToday(),
        
        setSigned: (key) => localStorage.setItem(key, Utils.getToday()),

        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms))
    };

    // ==========================================
    // 2. UI 状态管理模块
    // ==========================================
    const UI = {
        create: (siteName) => {
            if (document.getElementById('sign-status')) return;
            const div = document.createElement('div');
            div.id = 'sign-status';
            div.style.cssText = `
                position: fixed; top: 20px; right: 20px; padding: 12px 20px;
                border-radius: 8px; background: rgba(0, 0, 0, 0.85); color: white;
                font-family: "Microsoft YaHei", Arial, sans-serif; font-size: 14px;
                z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                display: flex; align-items: center; border-left: 4px solid #ffcc00;
                transition: all 0.3s ease; pointer-events: none;
            `;
            div.innerHTML = `<div id="status-text" style="font-weight:bold">【${siteName}】签到助手启动中...</div>`;
            document.body.appendChild(div);
        },
        update: (text, color = '#ffcc00', autoClose = false) => {
            const txt = document.getElementById('status-text');
            const div = document.getElementById('sign-status');
            if (txt) txt.innerText = text;
            if (div) div.style.borderLeftColor = color;
            if (autoClose) {
                setTimeout(() => div && div.remove(), 3000);
            }
        }
    };

    // ==========================================
    // 3. 通用签到策略
    // ==========================================
    const Strategies = {
        // Discuz! K_Misign 插件
        discuzMisign: async (rule) => {
            const btn = document.getElementById("JD_sign");
            if (btn) {
                btn.click();
                UI.update(`${rule.name} 签到成功 ✓`, '#00ff9d');
                Utils.setSigned(rule.key);
                await Utils.sleep(2000);
                location.reload();
            } else if (document.querySelector(".btnvisted")) {
                Utils.setSigned(rule.key);
                UI.update(`${rule.name} 今日已签到 ✓`, '#00ff9d', true);
            } else {
                if (document.body.innerText.includes("请先登录")) {
                    UI.update(`${rule.name} 未登录，停止脚本`, '#ff9900');
                } else {
                    UI.update(`${rule.name} 未找到按钮 ❌`, '#ff4d4d');
                }
            }
        },
    };

    // ==========================================
    // 4. 站点规则配置
    // ==========================================
    const SiteRules = [
        {
            id: 'acg', name: 'ACG', host: 'acgfun.pro', key: 'acg_signed',
            signUrl: 'https://acgfun.pro/plugin.php?id=k_misign:sign',
            checkUrl: 'plugin.php?id=k_misign:sign',
            action: Strategies.discuzMisign
        },
        {
            id: 'mt', name: 'MT论坛', host: 'bbs.binmt.cc', key: 'bbs_binmt_sign_date',
            signUrl: 'https://bbs.binmt.cc/k_misign-sign.html',
            checkUrl: 'k_misign-sign.html',
            action: Strategies.discuzMisign
        },
        {
            id: 'fishc', name: '鱼C论坛', host: 'fishc.com.cn', key: 'fishc_signed',
            signUrl: 'https://fishc.com.cn/plugin.php?id=k_misign:sign',
            checkUrl: 'plugin.php?id=k_misign:sign',
            action: Strategies.discuzMisign
        },
        {
            id: 'anywlan', name: 'AnyWlan', host: 'www.anywlan.com', key: 'anywlan_signed',
            signUrl: 'https://www.anywlan.com/plugin.php?id=k_misign:sign',
            checkUrl: 'k_misign:sign',
            action: Strategies.discuzMisign
        },
        {
            id: 'bika', name: '嗶咔', host: 'manhuabika.com', key: 'bika_sign_date',
            signUrl: 'https://manhuabika.com/puser/?vflush=' + Date.now(),
            checkUrl: '/puser/',
            action: async (rule) => {
                const btn = document.querySelector('button.my-punch-button');
                if (btn && btn.innerText.includes('打嗶咔')) {
                    btn.click();
                    Utils.setSigned(rule.key);
                    UI.update('嗶咔 漫畫签到成功 ✓', '#00ff9d');
                } else {
                    Utils.setSigned(rule.key);
                    UI.update('嗶咔 今日已签到或按钮不存在', '#00ff9d', true);
                }
            }
        },
        {
            id: 'pcbeta', name: '远景论坛', host: 'pcbeta.com', key: 'pcbeta_signed',
            signUrl: '/home.php?mod=task&do=apply&id=149',
            checkUrl: 'home.php?mod=task&do=apply&id=149',
            action: async (rule) => {
                const html = document.body.innerHTML;
                if (html.includes('任务已成功完成')) {
                    Utils.setSigned(rule.key);
                    UI.update('远景论坛 签到完成 ✓', '#00ff9d', true);
                } else if (html.includes('您已申请过此任务')) {
                    Utils.setSigned(rule.key);
                    UI.update('远景论坛 今日已签到 ✓', '#00ff9d', true);
                } else {
                    UI.update('远景论坛 签到失败(可能需登录)', '#ff4d4d');
                }
            }
        },
        {
            id: '52pojie', name: '52pojie', host: '52pojie.cn', key: '52pojie_signed',
            action: async (rule) => {
                const qdImg = document.querySelector("img[src$='qds.png']");
                const applyLink = document.querySelector('a[href^="home.php?mod=task&do=apply&id=2"]');
                const qdSigned = document.querySelector("img[src$='wbs.png']");
                if (qdImg && applyLink) {
                    applyLink.click();
                    Utils.setSigned(rule.key);
                    UI.update('52pojie 签到中...', '#00ff9d');
                } else if (qdSigned) {
                    Utils.setSigned(rule.key);
                    UI.update('52pojie 今日已签到 ✓', '#00ff9d', true);
                } else {
                    UI.update('52pojie 未找到签到入口', '#ffcc00', true);
                }
            }
        },
        {
            id: '55188', name: '理想论坛', host: '55188.com', key: '55188_signed',
            signUrl: 'https://www.55188.com/plugin.php?id=sign',
            checkUrl: 'plugin.php?id=sign',
            action: async (rule) => {
                const signBtn = document.getElementById('addsign');
                if (signBtn) {
                    Utils.setSigned(rule.key);
                    UI.update('55188 签到中...', '#00ff9d');
                    location.href = 'plugin.php?id=sign&mod=add&jump=1';
                } else {
                    UI.update('55188 今日已签到或按钮不存在', '#00ff9d', true);
                }
            }
        },
        {
            id: 'kafan',
            name: '卡饭论坛',
            host: 'bbs.kafan.cn',
            key: 'kafan_signed_v2', // 改了Key，强制重新检测，解决“没反应”的问题
            action: async (rule) => {
                UI.update(`正在寻找签到按钮...`, '#ffcc00');
                
                // 查找逻辑
                const findBtn = () => {
                    // 1. 找包含 dsu_amupper:work 的链接
                    let btn = document.querySelector('a[href*="dsu_amupper:work"]');
                    // 2. 找 dk.png 图片
                    if (!btn) {
                        const img = document.querySelector('img[src*="dsu_amupper/images/dk.png"]');
                        if (img) btn = img.closest('a') || img;
                    }
                    // 3. 找文本包含“打卡签到”的链接
                    if (!btn) {
                        const links = document.querySelectorAll('a');
                        for (let a of links) {
                            if (a.innerText && a.innerText.includes('打卡签到')) {
                                btn = a;
                                break;
                            }
                        }
                    }
                    return btn;
                };

                // 重试机制：循环 10 次，每次间隔 1 秒
                // 解决页面加载慢导致找不到按钮的问题
                let target = null;
                for (let i = 0; i < 10; i++) {
                    target = findBtn();
                    if (target) break; // 找到了就跳出循环
                    await Utils.sleep(1000);
                }

                // 检查是否已签到图标 (wb.png)
                const wbImg = document.querySelector('img[src*="dsu_amupper/images/wb.png"]');

                if (target) {
                    // 找到按钮，点击
                    target.click();
                    Utils.setSigned(rule.key);
                    UI.update('卡饭论坛 签到中...', '#00ff9d', true);
                } else if (wbImg) {
                    // 发现已签到图标
                    Utils.setSigned(rule.key);
                    UI.update('卡饭论坛 今日已签到 ✓', '#00ff9d', true);
                } else {
                    // 实在找不到，且当前不在签到页，则跳转
                    if (!location.href.includes('plugin.php?id=dsu_amupper:work')) {
                         UI.update(`未找到，尝试跳转插件页...`, '#ffcc00');
                         await Utils.sleep(1500);
                         window.location.href = 'https://bbs.kafan.cn/plugin.php?id=dsu_amupper:work';
                    } else {
                         UI.update('卡饭论坛 未找到签到按钮', '#ff4d4d', true);
                    }
                }
            }
        }
    ];

    // ==========================================
    // 5. 核心执行逻辑
    // ==========================================
    async function run() {
        const url = location.href;
        const rule = SiteRules.find(r => url.includes(r.host));
        if (!rule) return;

        console.log(`[自动签到] 命中规则: ${rule.name}`);

        // 检查已签到 (LocalStorage)
        if (Utils.isSigned(rule.key)) {
            console.log(`[自动签到] ${rule.name} 今日已签到，跳过。`);
            return; 
        }

        if (Utils.isBlockPage()) {
            console.log(`[自动签到] ${rule.name} 阻断页面，暂停。`);
            return;
        }

        // 强制跳转逻辑 (checkUrl)
        if (rule.checkUrl && !url.includes(rule.checkUrl)) {
            if (rule.signUrl) {
                UI.create(rule.name);
                UI.update(`跳转至签到页面...`, '#ffcc00');
                await Utils.sleep(500);
                window.location.href = rule.signUrl;
                return;
            }
        }

        // 执行
        UI.create(rule.name);
        try {
            await rule.action(rule);
        } catch (e) {
            console.error(e);
            UI.update('脚本执行出错', '#ff4d4d');
        }
    }

    // 延迟一点启动，等待页面基本元素
    setTimeout(run, 500);

})();