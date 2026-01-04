// ==UserScript==
// @name         小红书粉丝检查抽奖器 v4.4（抽奖版）
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  小红书自动检查粉丝关系，黑名单过滤，安全随机抽奖，CSV导出中奖名单！
// @author       Suzhiworkshops
// @match        https://www.xiaohongshu.com/explore/*
// @grant        GM_xmlhttpRequest
// @connect      xiaohongshu.com
// @downloadURL https://update.greasyfork.org/scripts/544674/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%B2%89%E4%B8%9D%E6%A3%80%E6%9F%A5%E6%8A%BD%E5%A5%96%E5%99%A8%20v44%EF%BC%88%E6%8A%BD%E5%A5%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544674/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%B2%89%E4%B8%9D%E6%A3%80%E6%9F%A5%E6%8A%BD%E5%A5%96%E5%99%A8%20v44%EF%BC%88%E6%8A%BD%E5%A5%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        maxConcurrent: 5,
        delayBetweenBatches: 1000,
        baseUrl: 'https://www.xiaohongshu.com'
    };

    let users = [], failedCount = 0, isProcessing = false;

    function createButton() {
        const button = document.createElement('button');
        button.textContent = '📤 开始抽奖';
        Object.assign(button.style, {
            position: 'fixed', top: '20px', right: '20px', padding: '10px 20px',
            backgroundColor: '#fe2c55', color: 'white', border: 'none',
            borderRadius: '20px', cursor: 'pointer', zIndex: 9999, fontSize: '14px', fontWeight: 'bold'
        });
        button.onclick = async () => {
            if (isProcessing) return alert('处理中，请稍候');
            isProcessing = true;
            button.disabled = true;
            button.textContent = '处理中...';
            try { await start(); }
            catch (e) { addLog(`❌ 错误：${e.message}`); }
            finally {
                isProcessing = false;
                button.disabled = false;
                button.textContent = '📤 粉丝检测';
            }
        };
        document.body.appendChild(button);
    }

    async function getBlacklist() {
        const input = prompt('输入黑名单关键词（逗号分隔）', '广告,测试,抽奖');
        return input ? input.split(',').map(k => k.trim()).filter(Boolean) : [];
    }

    async function start() {
        createPanel();
        const blacklist = await getBlacklist();
        addLog(`🔍 黑名单关键词：${blacklist.join(', ') || '无'}`);

        const nodes = document.querySelectorAll('.comment-item .name');
        if (!nodes.length) return addLog('⚠️ 未找到用户，先加载评论');

        const rawUsers = Array.from(nodes).map(el => ({
            username: el.textContent.trim(),
            userId: el.getAttribute('data-user-id') || '未知',
            profileUrl: CONFIG.baseUrl + el.getAttribute('href'),
            isFan: false, checked: false
        })).filter(u => u.profileUrl);

        const seen = new Set();
        const deduped = rawUsers.filter(u => seen.has(u.userId) ? false : seen.add(u.userId));

        users = deduped.filter(u => {
            const hit = blacklist.find(k => u.username.includes(k));
            if (hit) {
                addLog(`🚫 跳过：${u.username}（关键词：“${hit}”）`);
                return false;
            }
            return true;
        });

        addLog(`🎯 待检测用户：${users.length}人`);
        await processBatches(users, CONFIG.maxConcurrent);
        finalize();
    }

    async function processBatches(list, size) {
        for (let i = 0; i < list.length; i += size) {
            await Promise.all(list.slice(i, i + size).map(u => checkUser(u)));
            addLog(`📦 已检测：${Math.min(i + size, list.length)} / ${list.length}`);
            if (i + size < list.length) await sleep(CONFIG.delayBetweenBatches);
        }
    }

    async function checkUser(user) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET', url: user.profileUrl,
                headers: {'User-Agent': navigator.userAgent},
                onload: res => {
                    user.checked = true;
                    user.isFan = /互相关注|回关/.test(res.responseText);
                    addLog(`${user.isFan ? '❤️ 是粉丝' : '💔 非粉丝'}：${user.username}`);
                    resolve();
                },
                onerror: err => {
                    failedCount++;
                    addLog(`❌ 失败：${user.username}`);
                    resolve();
                }
            });
        });
    }

    function finalize() {
        const fans = users.filter(u => u.checked && u.isFan);
        addLog(`✅ 完成：成功检测${fans.length}个粉丝，失败${failedCount}`);

        const count = Math.min(parseInt(prompt(`输入中奖人数（最多${fans.length}）：`, '3')), fans.length);
        if (!count) return;

        const winners = secureShuffle(fans, count);
        addLog(`🏆 🎉 抽奖结果（${count}人）：`);
        winners.forEach((u, i) => addLog(`第${i + 1}名 🎁 ${u.username}`));

        exportCSV(winners, `中奖名单_${new Date().toISOString().slice(0, 10)}.csv`);
    }

    function secureShuffle(arr, count) {
        const res = [], used = new Set();
        while (res.length < count && used.size < arr.length) {
            const r = crypto.getRandomValues(new Uint32Array(1))[0] % arr.length;
            if (!used.has(r)) used.add(r) && res.push(arr[r]);
        }
        return res;
    }

    function exportCSV(data, filename) {
        const csv = [
            '\uFEFF用户名,用户ID,主页链接',
            ...data.map(u => `${u.username},${u.userId},${u.profileUrl}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = filename;
        link.textContent = '🎁 下载中奖名单';
        Object.assign(link.style, {
            display: 'block', marginTop: '8px', background: '#27ae60', color: '#fff',
            textAlign: 'center', padding: '10px 0', borderRadius: '20px', textDecoration: 'none', fontSize: '14px'
        });
        document.getElementById('xh-result-content').appendChild(link);
    }

    function createPanel() {
        if (document.getElementById('xh-result-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'xh-result-panel';
        panel.style = 'position:fixed;top:70px;right:20px;width:340px;max-height:70vh;background:#fff;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,0.1);overflow:auto;z-index:9999;font-family:sans-serif;color:#000';
        panel.innerHTML = `<div style='padding:12px;font-weight:bold;border-bottom:1px solid #eee;font-size:15px;color:#000'>📋 粉丝检测日志</div><div id='xh-result-content' style='padding:12px;font-size:14px;color:#000;'></div>`;
        document.body.appendChild(panel);
    }

    function addLog(text) {
        const area = document.getElementById('xh-result-content');
        if (!area) return;
        const p = document.createElement('p');
        p.textContent = text; p.style.margin = '4px 0'; p.style.color = '#000';
        if (/💔/.test(text)) p.style.color = '#888';
        if (/❌|🚫/.test(text)) p.style.color = '#c0392b';
        if (/✅|🎯|🏆/.test(text)) p.style.color = '#27ae60';
        if (/⚠️/.test(text)) p.style.color = '#e67e22';
        area.appendChild(p); area.scrollTop = area.scrollHeight;
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    createButton();
})();
