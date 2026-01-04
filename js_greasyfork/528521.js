// ==UserScript==
// @name         Gamee Score Modifier
// @version      1.3.3
// @description  提交你想要的 Gamee 分数
// @author       People11
// @match        https://prizes.gamee.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1143233
// @require      https://update.greasyfork.org/scripts/490306/1345896/Mini%20Md5.js
// @downloadURL https://update.greasyfork.org/scripts/528521/Gamee%20Score%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/528521/Gamee%20Score%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastData = null, isSubmitting = false, cookieCheckTimer = null;

    // 注入样式
    GM_addStyle(`#g-badge{position:fixed;bottom:10px;right:10px;color:#fff;padding:5px 10px;border-radius:5px;font-size:12px;z-index:9999;cursor:pointer}#g-badge.r{background:#f44336}#g-badge.y{background:#FFC107}#g-badge.g{background:#4CAF50}#g-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999}#g-dialog{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,.5);z-index:10000;width:500px;max-height:80vh;overflow-y:auto}#g-dialog h2{margin-bottom:15px}#g-dialog input,#g-dialog textarea{width:100%;padding:8px;box-sizing:border-box;margin:5px 0}#g-dialog textarea{height:150px;font-family:monospace}#g-dialog label{display:block;margin-top:15px;font-weight:700}#g-dialog .result{margin-top:15px;padding:10px;background:#f5f5f5;border-radius:5px;border:1px solid #ddd}.g-btn{padding:8px 16px;color:#fff;border:none;border-radius:4px;cursor:pointer}.g-btn.preview{display:block;width:100%;margin-top:15px;background:#2196F3}.g-btns{display:flex;justify-content:space-between;margin-top:15px}.g-btn.submit{background:#4CAF50;flex:1;margin-right:10px}.g-btn.cancel{background:#f44336;flex:1}`);

    // 工具函数
    const t = {
        // 计算校验和
        cs: (s, t, u, d, i) => shenchanran_md5(`${s}:${t}:${u}:${d||""}:${i}:crmjbjm3lczhlgnek9uaxz2l9svlfjw14npauhen`),
        // 生成UUID
        id: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => (c==='x'?(Math.random()*16|0):(Math.random()*16|0&3|8)).toString(16)),
        // 时间格式化
        now: () => {
            const d = new Date(), 
                  o = d.getTimezoneOffset(),
                  p = n => String(n).padStart(2,'0');
            return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}${o<=0?'+':'-'}${p(Math.abs(o/60|0))}:${p(Math.abs(o%60))}`;
        },
        // 获取下一个ID
        next: () => {
            let id = lastData?.metadata?.gameplayId;
            id = parseInt(id) + 1;
            return id;
        },
        // 检查认证cookie
        has: () => document.cookie.includes('authentication=') && document.cookie.includes('uuid='),
        // 获取认证数据
        get: () => {
            const c = document.cookie.split(';').map(c => c.trim());
            const a = c.find(c => c.startsWith('authentication='))?.substring(15);
            const u = c.find(c => c.startsWith('uuid='))?.substring(5);
            return a && u ? {token: "Bearer " + a, uuid: u} : null;
        }
    };

    // 设置网络捕获
    function setupCapture() {
        // 拦截XHR
        const xhrOpen = XMLHttpRequest.prototype.open;
        const xhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(m, u) {
            this._url = u;
            return xhrOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(b) {
            if (this._url?.includes('api.gamee.com') && !isSubmitting && b && typeof b === 'string') {
                try {
                    const d = JSON.parse(b);
                    if (d.method === 'game.saveWebGameplay' && d.params?.gameplayData) {
                        lastData = d.params.gameplayData;
                        updateBadge();
                    }
                } catch(e) {}
            }
            return xhrSend.apply(this, arguments);
        };
    }

    // 更新状态徽章
    function updateBadge() {
        const b = document.getElementById('g-badge');
        if (!b) return;

        const ready = t.has();

        // 设置徽章状态
        b.className = ready ? (lastData ? 'g' : 'y') : 'r';
        b.textContent = ready ? (lastData ? `已捕获: ${lastData.gameId} (${lastData.score})` : '已就绪，未捕获') : '未就绪';

        // 管理cookie检查定时器
        if (!ready && !cookieCheckTimer) {
            cookieCheckTimer = setInterval(() => t.has() && updateBadge(), 1000);
        } else if (ready && cookieCheckTimer) {
            clearInterval(cookieCheckTimer);
            cookieCheckTimer = null;
        }
    }

    // 添加状态徽章
    function addBadge() {
        const b = document.getElementById('g-badge') || document.createElement('div');
        b.id = 'g-badge';
        b.className = 'r';
        b.textContent = '未就绪';
        b.title = '点击打开分数修改器';
        b.addEventListener('click', openDialog);
        document.body.appendChild(b);
        updateBadge();
    }

    // 打开修改对话框
    function openDialog() {
        if (!t.has()) {
            alert('未找到认证信息，请确保已登录并刷新页面');
            return;
        }

        if (!lastData) {
            alert('尚未捕获到分数，请先玩一次游戏并提交分数');
            return;
        }

        // 创建对话框
        const overlay = document.createElement('div');
        overlay.id = 'g-overlay';

        const dialog = document.createElement('div');
        dialog.id = 'g-dialog';
        dialog.innerHTML = `
            <h2>修改游戏分数</h2>
            <div>
                <p><strong>游戏ID:</strong> ${lastData.gameId}</p>
                <p><strong>当前分数:</strong> ${lastData.score}</p>
                <p><strong>当前时长:</strong> ${lastData.playTime} 秒</p>
            </div>
            <label>目标分数：</label>
            <input type="number" id="g-score" value="${lastData.score}">
            <div class="result" id="g-result" style="display:none"></div>
            <button class="g-btn preview" id="g-preview">预览修改结果</button>
            ${lastData.gameStateData ? '<label>其他数据：</label><textarea id="g-state"></textarea>' : ''}
            <div class="g-btns">
                <button class="g-btn submit" id="g-submit">提交修改后的分数</button>
                <button class="g-btn cancel" id="g-cancel">取消</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 填充游戏状态数据
        if (lastData.gameStateData) {
            try {
                document.getElementById('g-state').value = JSON.stringify(JSON.parse(lastData.gameStateData), null, 2);
            } catch(e) {
                document.getElementById('g-state').value = lastData.gameStateData;
            }
        }

        // 添加事件监听
        document.getElementById('g-preview').addEventListener('click', previewScore);
        document.getElementById('g-submit').addEventListener('click', submitScore);
        document.getElementById('g-cancel').addEventListener('click', () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });
    }

    // 预览修改结果
    function previewScore() {
        const score = parseInt(document.getElementById('g-score').value, 10);
        if (isNaN(score) || score <= 0) {
            alert('请输入有效的分数值');
            return;
        }

        const mult = score / lastData.score;
        const time = Math.round(lastData.playTime * mult);
        const id = t.id();
        const state = document.getElementById('g-state')?.value || lastData.gameStateData;
        const checksum = t.cs(score, time, lastData.gameUrl, state, id);

        document.getElementById('g-result').innerHTML = `
            <p><strong>修改后分数:</strong> ${score} (${mult.toFixed(2)}倍)</p>
            <p><strong>修改后时长:</strong> ${time} 秒</p>
            <p><strong>UUID:</strong> ${id}</p>
            <p><strong>Checksum:</strong> ${checksum}</p>
        `;
        document.getElementById('g-result').style.display = 'block';
    }

    // 提交修改后的分数
    function submitScore() {
        const auth = t.get();
        if (!auth) {
            alert('认证信息已过期，请刷新页面后重试');
            return;
        }

        const score = parseInt(document.getElementById('g-score').value, 10);
        if (isNaN(score) || score <= 0) {
            alert('请输入有效的分数值');
            return;
        }

        const mult = score / lastData.score;
        const time = Math.round(lastData.playTime * mult);
        const newId = t.id();
        let state = lastData.gameStateData;

        // 验证游戏状态数据
        if (document.getElementById('g-state')) {
            try {
                state = document.getElementById('g-state').value;
                JSON.parse(state); // 验证JSON
            } catch(e) {
                alert('游戏状态数据不是有效的JSON格式');
                return;
            }
        }

        // 构建修改后的数据
        const modData = {
            ...lastData,
            score,
            playTime: time,
            uuid: newId,
            createdTime: t.now(),
            gameStateData: state,
            metadata: {
                ...(lastData.metadata || {}),
                gameplayId: t.next()
            }
        };

        // 计算新校验和
        modData.checksum = t.cs(score, time, modData.gameUrl, state, newId);

        // 提交修改后的分数
        isSubmitting = true;
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.gamee.com/",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                "Authorization": auth.token,
                "X-Install-UUID": auth.uuid,
                "X-Bot-Header": "gamee",
                "Origin": "https://prizes.gamee.com",
                "Referer": "https://prizes.gamee.com/",
                "User-Agent": navigator.userAgent
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                id: "game.saveWebGameplay",
                method: "game.saveWebGameplay",
                params: { gameplayData: modData }
            }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    alert(result.result ? '分数修改成功！' : '分数修改失败：' + JSON.stringify(result.error || '未知错误'));
                    if (result.result) window.location.reload();
                } catch(e) {
                    alert('解析响应失败：' + e.message);
                }
                isSubmitting = false;
            },
            onerror: e => {
                alert('请求出错：' + e.message);
                isSubmitting = false;
            }
        });

        // 关闭对话框
        document.body.removeChild(document.getElementById('g-dialog'));
        document.body.removeChild(document.getElementById('g-overlay'));
    }

    // 清理资源
    window.addEventListener('beforeunload', () => cookieCheckTimer && clearInterval(cookieCheckTimer));

    // 初始化
    (document.readyState === 'loading') ? 
        document.addEventListener('DOMContentLoaded', () => { setupCapture(); addBadge(); }) : 
    (setupCapture(), addBadge());
})();