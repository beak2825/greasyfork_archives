// ==UserScript==
// @name         🔥任何网页下完成🔥ZNDS智能电视论坛全后台自动签到
// @namespace    https://greasyfork.org/zh-CN/users/690532-xht1810
// @version      1.2.3
// @description  在任何网页下完成智能电视网论坛签到, 使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_notification
// @connect      www.znds.com
// @match        *://*/*
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531293/%F0%9F%94%A5%E4%BB%BB%E4%BD%95%E7%BD%91%E9%A1%B5%E4%B8%8B%E5%AE%8C%E6%88%90%F0%9F%94%A5ZNDS%E6%99%BA%E8%83%BD%E7%94%B5%E8%A7%86%E8%AE%BA%E5%9D%9B%E5%85%A8%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/531293/%F0%9F%94%A5%E4%BB%BB%E4%BD%95%E7%BD%91%E9%A1%B5%E4%B8%8B%E5%AE%8C%E6%88%90%F0%9F%94%A5ZNDS%E6%99%BA%E8%83%BD%E7%94%B5%E8%A7%86%E8%AE%BA%E5%9D%9B%E5%85%A8%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

/* global Swal */
const ZNDS = {
    name: '智能电视论坛',
    domain: 'www.znds.com',
    signURL: 'https://www.znds.com/plugin.php?id=ljdaka:daka&action=msg',
    homeURL: 'https://www.znds.com',
    lastSignKey: 'ZNDS_LAST_SIGN',
    ignoreKey: 'ZNDS_IGNORE',
    cookieKey: 'ZNDS_COOKIE',

    // 核心方法：执行签到（带完整错误恢复）
    async sign() {
        // 1. 检查忽略状态
        if (this.isIgnored()) {
            console.log('[ZNDS] 今日已忽略签到');
            return;
        }

        // 2. 获取formhash（自动重试机制）
        let retry = 0;
        while (retry < 3) {
            const formhash = await this.getFormhash();
            if (!formhash) {
                retry++;
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }

            // 3. 发送签到请求
            const result = await this.sendSignRequest(formhash);
            if (result.success) return this.onSuccess();

            // 4. 处理特定失败情况
            if (result.reason === 'already') {
                this.onAlreadySigned();
                return;
            }

            retry++;
        }

        // 5. 最终失败处理
        this.onFail();
    },

    // 获取formhash（带缓存和自动刷新）
    async getFormhash() {
        // 尝试从缓存获取
        const cachedHash = GM_getValue('ZNDS_FORMHASH');
        if (cachedHash) return cachedHash;

        // 后台获取最新formhash
        const html = await this.fetchPage(this.homeURL);
        const hashMatch = html.match(/formhash=([a-f0-9]{8})/);
        if (hashMatch) {
            GM_setValue('ZNDS_FORMHASH', hashMatch[1]);
            return hashMatch[1];
        }
        return null;
    },

    // 发送签到请求
    async sendSignRequest(formhash) {
        try {
            const url = `${this.signURL}&formhash=${formhash}&inajax=1`;
            const response = await this.fetchPage(url);

            if (response.includes("签到成功")) {
                return { success: true };
            } else if (response.includes("已签到")) {
                return { success: false, reason: 'already' };
            } else {
                return { success: false, reason: 'unknown' };
            }
        } catch (e) {
            return { success: false, reason: 'error' };
        }
    },

    // 通用页面获取
    fetchPage(url) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 10000,
                onload: (res) => resolve(res.responseText),
                onerror: () => resolve('')
            });
        });
    },

    // 状态检查方法
    isIgnored() {
        const lastIgnore = GM_getValue(this.ignoreKey, 0);
        return new Date().setHours(0,0,0,0) === new Date(lastIgnore).setHours(0,0,0,0);
    },

    // 结果处理方法
    onSuccess() {
        GM_setValue(this.lastSignKey, Date.now());
        GM_notification({
            title: `${this.name}签到成功`,
            text: '积分已到账',
            timeout: 2000
        });
    },

    onAlreadySigned() {
        GM_setValue(this.lastSignKey, Date.now());
        console.log('[ZNDS] 今日已签到');
    },

    onFail() {
        Swal.fire({
            icon: 'error',
            title: `${this.name}签到失败`,
            html: `
                <div style="text-align:left">
                    <b>可能原因：</b>
                    <ul style="padding-left:20px;margin:5px 0">
                        <li>未登录或登录过期</li>
                        <li>网络连接问题</li>
                        <li>网站改版导致脚本失效</li>
                    </ul>
                </div>
            `,
            confirmButtonText: '手动签到',
            cancelButtonText: '今日忽略',
            showCancelButton: true
        }).then(res => {
            if (res.isConfirmed) {
                GM_openInTab(this.homeURL, { active: true });
            } else {
                GM_setValue(this.ignoreKey, Date.now());
            }
        });
    }
};

// ================== 执行逻辑 ==================
(function() {
    'use strict';

    // 1. 每日自动执行
    const lastSign = GM_getValue(ZNDS.lastSignKey, 0);
    const today = new Date().setHours(0,0,0,0);

    if (today > new Date(lastSign).setHours(0,0,0,0)) {
        ZNDS.sign();
    }

    // 2. 定时检查（每6小时）
    setInterval(() => {
        if (today > new Date(lastSign).setHours(0,0,0,0)) {
            ZNDS.sign();
        }
    }, 6 * 1200 * 1000);
})();