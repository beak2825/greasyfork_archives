// ==UserScript==
// @name         PtTime后台自动签到
// @namespace    https://greasyfork.org/zh-CN/users/955952-ukid
// @version      1.0
// @description  在任何网页下完成PTTIME论坛签到, 使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE2UlEQVR4nO2aeYhWVRjGf02jYs5YUrTYQlKp0YJQSUUGNTUtVloiBIFSUUi2UJBGJCRkzpRBUVFR0PKHFbRRUKGRS2ZFCy1EqVhpTZljVk6bbVdeeK68XO795pv57vZdfeAwyzn3nPPc8+7nQjEYBcwEXgI2A78BHwLXAq1UBPsCM4BXgO1AkNDeB8bQpDgMuAFYCfznSP0DLAVmAYcCw4ApwDfq3wJMpkkwRiRXAf87kn+JpPUdkPDs3sBzGm/P3gcMoYQ4Bpgrkl48/5AImyiPrHOuPfRS/tYcK4DRaW52MvBdgj71At0xhsQ2NRHoAtZFntkKPCkRHd7Avk4HejTnJuBMUsK3NQxI2BZJH8+RmG2M9NuGHgE6UxbB/YE3tMa/wDygpdFJA7U4nFbjJWwA7tVJ7El2sLnnO6P3OrBfVoR9v/nLd4GFwEkS6zzRqT0EkspTsyacJa6RHdkiuzAiYdwhzjCaUbtpMC8+KJBwO/BMjLp8DZyb8IwZ0NudiL+syK30hCc4C/8LMA04USFmuOZiGa44TJFHsHHrgRPKTHgG8Lvm/Qg4MnKC5of71P+z/o6zzuY53nGBjY0rFeHhwKNuzqeAvRLGHg685sZaeHp0zLhhcpXhuOcVsSUiK8Jv1+HfB9r+BG5L8PWXAts07gvg2LwJv5UB4bB9luCWxgGfaoypzMw8CacN0+2pLsY2K/1gTIxuKvK42/dj0RC3WQiHWBE5bfPfF8eMu1zJi435GBjbjITNGP2g/UyP2IkXgYMj448H1qj/J4l83YQtGHhWIV5esLSwQ5HYA4rfAxFFrsr6ftX/7efsiAtr18uw/lc9oThMSjAaqxqJZWN0c6z08xbgCeA9BSNxa38g/+thJ/uCG7MaOM71j3IvpK70sFvBwRylgt7n7dSNftCmaOgyYIEqG5/3U9/qlc5a6nkjcEo/6eFUl9ubcbsD2Ae4wrkrzqtBenNMAaBNsWyfm/ghkbE3eRBwhupVFhAscaIY18zafiVxs7z7KqWlVvQbDMxq3x+poQVqV9IADgQeVkGuHt9pod8nsgPzFShMaLAqUgsnK3c21VgLXJ3WxON0kusknj9Kh8z/3QxcAByRcZFgN3aj5LBcd7muYKwtAy6kouiqYfjMnVXuZAMZvzmKtEaryB/6azOClcFykTKCUcxV35tUCH0iZcFLnN8PlORXAq0unVutEHa72ib9L9CYpr5DHilxjV7f1GobpeOWCTUVLorE8V/KSltKOF4F+RH6/SzF9WsixJvCXbUA90Ru/QdyO9ihNDF8flEal2xZwTb2tMu0Zg/ynsqeuc4lL4vLSvpubXCr0shG0aFifZi3lwqXuJNNg6wnHZ60FQFKgTZnoEyM08b1mntDjdvHXDHPGags7pZbdE9la9xKwWh1tabUvtWIwdnulAstOJzvi2gZY63Wsu9RCsNd2oR9LpGXF7iTAhHeEJg1zRqd7nq1MIRx8lE5rDVea9lnjIUhzILMNWWNdnddmjuGOP0tonXnnUqGBqTI1p0n4V4tmtbF20AQfkVo10W5IXzLRSHIe/1SEh4qOf++BPqWVetRJWVof4XvqrUu3EfYRRiWvA1YTxn0LC8EIc9djnCPfrFjryomeZHelYzWQiNsptpIhyddxbbTLe0A1mY9bPYt6XkAAAAASUVORK5CYII=
// @author       bear
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @connect      www.pttime.org
// @match        *://*/*
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/540073/PtTime%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540073/PtTime%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

/* global Swal */
const AutoSign = {
    name: 'PtTime',
    homeURL: 'https://www.pttime.org',
    lastSignKey: 'AUTOSIGN_LAST_SIGN',
    ignoreKey: 'AUTOSIGN_IGNORE',

    // 核心方法：执行签到（带完整错误恢复）
    async sign() {
        const lastSign = GM_getValue(AutoSign.lastSignKey, 0);
        const today = new Date().setHours(0,0,0,0);

        // 静默处理
        if (today <= new Date(lastSign).setHours(0,0,0,0)) {
            console.log('[AUTOSIGN] 今日已签到');
            return;
        }

        // 检查忽略状态
        if (this.isIgnored()) {
            console.log('[AUTOSIGN] 今日已忽略签到');
            return;
        }

        // 获取签到状态、签到
        let retry = 0;
        while (retry < 3) {
            // 获取签到状态
            const signInfo = await this.getSignInfo();
            console.log(signInfo);
            if (!signInfo) {
                retry++;
                await new Promise(r => setTimeout(r, 10000));
                continue;
            }

            // 已签到
            if("signed" === signInfo.status){
                this.onAlreadySigned();
                return;
            }

            // 发送签到请求
            const result = await this.sendSignRequest(signInfo.signUrl);
            if (result) {
                return this.onSuccess(result);
                return;
            }

            retry++;
        }

        // 最终失败处理
        this.onFail();
    },

    // 提取签到地址
    async extractLink(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a.faqlink'));
        const targetLink = links.find(el => el.innerText.trim() === '签到领魔力');
        return targetLink ? `${targetLink.pathname}${targetLink.search}` : null;
    },

    // 获取签到状态
    async getSignInfo() {
        const html = await this.fetchPage(this.homeURL);
        if(html.match(/签到领魔力/)){
            return { status: "unsign", signUrl: this.extractLink(html) };
        }else if(html.match(/签到详情/)){
            return { status: "signed" };
        }else {
            return null;
        }
    },

    // 提取总签到天数和连续签到天数
    async extractSignInfoRegex(html) {
        const signInfoRegex = /这是你的第\s*<b>(\d+)<\/b>\s*次签到，已连续签到\s*<b>(\d+)<\/b>\s*天，本次签到获得\s*<b>(\d+)<\/b>\s*个魔力值/;
        const signInfoMatch = html.match(signInfoRegex);
        if (signInfoMatch) {
            let signDays = parseInt(signInfoMatch[1], 10);
            let continuousDays = parseInt(signInfoMatch[2], 10);
            let magicPoints = parseInt(signInfoMatch[3], 10);
            return {
                signDays,
                continuousDays,
                magicPoints
            };
        } else {
            return null;
        }
    },

    // 发送签到请求
    async sendSignRequest(signUrl) {
        try {
            const url = `${this.homeURL}${await signUrl}`;
            const html = await this.fetchPage(url);
            return this.extractSignInfoRegex(html);
        } catch (e) {
            console.log(e);
        }
        return null;
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
    onSuccess(signInfo) {
        let { signDays, continuousDays, magicPoints } = signInfo;
        GM_setValue(this.lastSignKey, Date.now());
        Swal.fire({
            icon: 'success',
            title: `${this.name}第${signDays}天签到成功`,
            text: `获取到${magicPoints}魔力值，已连续签到${continuousDays}天。`,
            timer: 8000,
            timerProgressBar: true,
            showConfirmButton: true
        });
    },

    // 已经签到过
    onAlreadySigned() {
        GM_setValue(this.lastSignKey, Date.now());
        Swal.fire({
            icon: 'info',
            title: `今日已签到`,
            text: `好奇怪，今天怎么已经签到过了`,
            timer: 8000,
            timerProgressBar: true,
            showConfirmButton: true
        });
    },

    // 签到失败
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

    AutoSign.sign();

    // 定时检查（每1小时）
    setInterval(() => {
        AutoSign.sign();
    }, 3600 * 1000);
})();