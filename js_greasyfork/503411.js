// ==UserScript==
// @name         种审按钮
// @namespace    http://tampermonkey.net/
// @version      2.2
// @author       您的名字
// @match        https://springsunday.net/details.php*
// @match        https://springsunday.net/edit.php?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.douban.com
// @connect      movie.douban.com
// @connect      www.douban.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @description  修复按钮点击报错问题（改用原生Fetch处理站内请求），保持豆瓣跳转功能
// @downloadURL https://update.greasyfork.org/scripts/503411/%E7%A7%8D%E5%AE%A1%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/503411/%E7%A7%8D%E5%AE%A1%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 样式定义 (CSS)
    // ==========================================
    GM_addStyle(`
        .tm-btn {
            position: fixed; right: 10px; z-index: 9999;
            color: white; font-size: 16px; padding: 4px 10px;
            border-radius: 6px; cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            border: 1px solid rgba(0,0,0,0.1);
        }
        .tm-btn:not(.tm-disabled):hover {
            background-color: #d32f2f !important;
            border-color: #b71c1c !important;
            transform: translateY(-1px);
        }
        .tm-btn:active { transform: translateY(1px); }
        .tm-green  { background-color: #4CAF50; }
        .tm-blue   { background-color: #2196F3; }
        .tm-purple { background-color: #8e44ad; }
        .tm-gray   { background-color: #95a5a6; }
        .tm-disabled { cursor: not-allowed !important; opacity: 0.7; background-color: #7f8c8d !important; }
        .tm-red { background-color: #f44336; margin-left: 10px; padding: 2px 8px; font-size: 14px; position: static; }
        .tm-abs { position: absolute; top: 5px; right: 5px; }
    `);

    // ==========================================
    // 2. 核心工具函数
    // ==========================================

    function createBtn(text, top, colorClass, onClick) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = `tm-btn ${colorClass}`;
        if (top !== null) btn.style.top = `${top}px`;
        if (onClick) btn.onclick = onClick;
        document.body.appendChild(btn);
        return btn;
    }

    // [跨域专用] 用于豆瓣查询 (保留 GM_xmlhttpRequest)
    const gmFetch = (url, method = 'GET', data = null) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method, url, data,
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
                onload: (res) => resolve(res.status >= 200 && res.status < 400 ? res.responseText : null),
                onerror: () => resolve(null)
            });
        });
    };

    // [站内专用] 用于操作按钮 (改用原生 Fetch，自动携带 Cookie)
    const siteFetch = async (url, data) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            });
            // 只要服务器返回 200-299 都算成功，不管内容是什么（有些PT站成功不返回JSON）
            return response.ok;
        } catch (err) {
            console.error("站内请求失败:", err);
            return false;
        }
    };

    const getParam = (name) => new URLSearchParams(window.location.search).get(name);

    // ==========================================
    // 3. 豆瓣查找逻辑
    // ==========================================
    async function getDoubanUrl(imdbId) {
        const API_KEYS = ["0ab215a8b1977939201640fa14c66bab", "0df993c66c0c636e29ecbb5344252a4a", "0b2bdeda43b5688921839c8ecb20399b"];
        // 策略1: API
        for (let key of API_KEYS) {
            const res = await gmFetch(`https://api.douban.com/v2/movie/imdb/${imdbId}`, "POST", `apikey=${key}`);
            try {
                const json = JSON.parse(res);
                if (json?.alt) return json.alt.replace(/\/movie\//, '/subject/').replace(/^http:/, 'https:');
            } catch (e) {}
        }
        // 策略2: Suggest
        try {
            const json = JSON.parse(await gmFetch(`https://movie.douban.com/j/subject_suggest?q=${imdbId}`));
            if (json?.[0]?.id) return `https://movie.douban.com/subject/${json[0].id}/`;
        } catch (e) {}
        // 策略3: 搜索
        const searchRes = await gmFetch(`https://www.douban.com/search?cat=1002&q=${imdbId}`);
        return searchRes?.match(/https:\/\/movie\.douban\.com\/subject\/\d+\//)?.[0] || null;
    }

    function getImdbId() {
        const link = document.querySelector('.title .name a[href*="imdb.com/title/tt"]') ||
                     document.querySelector('a[href*="imdb.com/title/tt"]');
        return link?.href.match(/(tt\d+)/)?.[1] || null;
    }

    // ==========================================
    // 4. 主逻辑: /details.php
    // ==========================================
    if (window.location.href.includes("/details.php")) {
        const itemId = getParam('id');
        const hasAllow = document.querySelector('[onclick*="allowoffer"]');
        const hasCheck = document.querySelector('[onclick*="checktorrent"]');

        if (hasAllow && hasCheck) return alert("错误：页面冲突，同时包含候选和审核操作。");

        const actions = [
            { label: "硬字幕", action: "trumptorrent", reason: "硬字幕" },
            { label: "无中字", action: "trumptorrent", reason: "无中字" },
            { label: "音频臃肿", action: "trumptorrent", reason: "音频臃肿" },
            { label: "中性", action: "settorrenttag", tag: "neutral" },
            { label: "已取代", action: "settorrenttag", tag: "superseded" }
        ];
        if (hasAllow) actions.push({ label: "通过候选", action: "allowoffer" });
        if (hasCheck) actions.push({ label: "通过审核", action: "checktorrent" });

        const startTop = 50;
        actions.forEach((act, idx) => {
            createBtn(act.label, startTop + 40 * idx, "tm-green", async function() {
                const btn = this;
                const originalText = btn.textContent;
                btn.textContent = "处理中...";
                btn.className += " tm-gray"; // 变灰防止重复点击

                const url = `https://springsunday.net/admin.php?action=${act.action}`;
                let data = `tid=${itemId}`;
                if (act.reason) data += `&type=set&reason=${encodeURIComponent(act.reason)}`;
                else if (act.tag) data += `&tag=${encodeURIComponent(act.tag)}`;

                // --- 核心修改：使用 siteFetch (原生Fetch) ---
                const success = await siteFetch(url, data);

                btn.className = btn.className.replace(" tm-gray", "");
                if (success) {
                    btn.textContent = "完成";
                    btn.style.backgroundColor = "#27ae60"; // 成功变深绿
                } else {
                    btn.textContent = "失败";
                    btn.style.backgroundColor = "#c0392b"; // 失败变深红
                    console.error("请求URL:", url, "数据:", data); // 方便F12调试
                }
            });
        });

        // 删种功能
        let deleteEnabled = false;
        createBtn("显示删种", 10, "tm-blue", function() {
            deleteEnabled = !deleteEnabled;
            this.textContent = deleteEnabled ? "隐藏删种" : "显示删种";
            if (!deleteEnabled) return $('button:contains("删除")').remove();

            $('#krelated tr').each(function() {
                const $td = $(this).find('td:first');
                const $link = $td.find('a');
                if ($link.length === 0 && $td.find('.related-torrent-title').length === 0) return;
                const linkId = $link.length ? new URLSearchParams($link[0].search).get('id') : itemId;
                const $delBtn = $('<button>').text('删除').addClass('tm-btn tm-red');

                $delBtn.on('click', async () => {
                    if(!confirm("确认删除此单集？")) return;
                    const formData = new URLSearchParams();
                    formData.append('action', 'delete');
                    formData.append('id', linkId);
                    formData.append('reasontype', '5');
                    ['', '', '', '', '删除单集'].forEach(r => formData.append('reason[]', r));

                    // 删除功能也改用 fetch
                    try {
                        const res = await fetch('https://springsunday.net/delete.php', { method: 'POST', body: formData });
                        $delBtn.text(res.ok ? '成功' : '失败');
                    } catch(e) { $delBtn.text('错误'); }
                });
                ($link.length ? $link : $td.find('.related-torrent-title')).after($delBtn);
            });
        });

        // 豆瓣跳转 (保持不变，使用 gmFetch)
        const imdbId = getImdbId();
        const hasImdb = !!imdbId;
        createBtn(
            hasImdb ? "跳转豆瓣" : "未找到 IMDB",
            startTop + 40 * actions.length,
            hasImdb ? "tm-purple" : "tm-gray tm-disabled",
            async function() {
                if (!hasImdb) return;
                const originalText = this.textContent;
                this.textContent = "查询中...";
                this.className = "tm-btn tm-gray tm-loading";
                const url = await getDoubanUrl(imdbId);
                if (url) {
                    this.textContent = "正在跳转";
                    window.open(url, '_blank');
                    setTimeout(() => { this.textContent = originalText; this.className = "tm-btn tm-purple"; }, 1000);
                } else {
                    this.textContent = "未找到条目";
                    setTimeout(() => { this.textContent = originalText; this.className = "tm-btn tm-purple"; }, 2000);
                }
            }
        );

        var lastTr = null;
        $(document).on('click', "#krelated tr td[style*='background-color: #f5f5f5']", function() {
            const tr = $(this).closest('tr');
            const targetTrs = tr.nextAll('tr');
            const action = (lastTr && lastTr.is(tr)) ? 'toggle' : 'hide';
            targetTrs.each(function() {
                if ($(this).find("td[style*='background-color: #f5f5f5']").length === 0) action === 'toggle' ? $(this).toggle() : $(this).hide();
                else return false;
            });
            lastTr = tr;
        });
    }

    if (window.location.href.includes("/edit.php")) {
        const form = document.getElementById('compose');
        if (form) {
            if (getComputedStyle(form).position === 'static') form.style.position = 'relative';
            const btn = document.createElement("button");
            btn.textContent = "提交编辑";
            btn.className = "tm-btn tm-green tm-abs";
            btn.onclick = (e) => { e.preventDefault(); form.submit(); };
            form.appendChild(btn);
        }
    }
})();