// ==UserScript==
// @name         Bing Rewards Lite (Ultimate Edition)
// @version      1.8.0
// @description  v1.8.0 | 最终版。脚本可根据热搜词的复杂度，智能选择更合适的提问方式。
// @match        https://*.bing.com/*
// @match        https://*.bing.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setTimeout
// @grant        GM_clearTimeout
// @grant        GM_setInterval
// @grant        GM_clearInterval
// @connect      api.vvhan.com
// @connect      api-hot.imsyy.top
// @license      MIT
// @namespace    https://greasyfork.org/users/737649
// @downloadURL https://update.greasyfork.org/scripts/534088/Bing%20Rewards%20Lite%20%28Ultimate%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534088/Bing%20Rewards%20Lite%20%28Ultimate%20Edition%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ===== 基本配置 ===== */
    const ID = 'bru_panel';
    const VER = '2.2.0';
    const STORAGE_KEY = 'bru_lite_v220_smart_template';
    const BASE_TYPE = { min: 35, max: 80, error_chance: 0.03 };
    const FALL = ['今日新闻', '天气预报', '电影票房', '体育比分', '股票行情'];
    const HOT_APIS = [ 'https://api.vvhan.com/api/hotlist/all', 'https://api.vvhan.com/api/hotlist/wbHot', 'https://api-hot.imsyy.top/baidu?num=50' ];
    const SELECTORS = ['#sb_form_q', '.b_searchbox', 'input[name="q"]', '#searchboxinput', 'textarea[name="q"]'];
    
    // --- 智能模板库 ---
    // 创造性模板库 (适用于短语/名词)
    const CREATIVE_TEMPLATES = [
        '如何评价 [KW]', '怎么看待 [KW]', '关于 [KW] 的讨论', '[KW] 的背后故事',
        '[KW] 的影响', '为什么 [KW] 很重要', '除了 [KW] 还有什么', '和 [KW] 类似的话题'
    ];
    // 通用模板库 (适用于所有情况，尤其是长句子)
    const UNIVERSAL_TEMPLATES = [
        '[KW] 是什么', '[KW] 的意思', '关于 [KW] 的资料', '[KW] 维基百科', '[KW] 官方网站',
        '搜索 [KW]', '查找 [KW]', '[KW] 最新消息', '[KW] 最新动态', '[KW] 相关新闻',
        '最近的 [KW] 事件', '和 [KW] 有关的头条', '[KW] 图片', '[KW] 视频', '[KW] 相关推荐'
    ];
    
    /* ===== 通用工具 ===== */
    const tSet = (typeof GM_setTimeout === 'function' ? GM_setTimeout : setTimeout);
    const tClr = (typeof GM_clearTimeout === 'function' ? GM_clearTimeout : clearTimeout);
    const iSet = (typeof GM_setInterval === 'function' ? GM_setInterval : setInterval);
    const iClr = (typeof GM_clearInterval === 'function' ? GM_clearInterval : clearInterval);
    const z2 = n => (n < 10 ? '0' : '') + n;
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    /* ===== 状态记录 ===== */
    const today = new Date().toISOString().slice(0, 10);
    const def = {
        date: today, pc: 0, ph: 0, running: false, max_pc: 40, max_ph: 30,
        batch_size_min: 2, batch_size_max: 5, current_batch_target: 3,
        sleep_min: 600000, sleep_max: 900000, search_delay_min: 120000, search_delay_max: 240000,
        batch_count: 0, batch_searches_done: 0, is_sleeping: false
    };
    let rec = { ...def, ...GM_getValue(STORAGE_KEY, {}) };
    if (rec.date !== today) {
        const oldSettings = { ...rec };
        rec = { ...def, date: today, pc: 0, ph: 0 };
        for (const key of ['max_pc', 'max_ph', 'batch_size_min', 'batch_size_max', 'sleep_min', 'sleep_max', 'search_delay_min', 'search_delay_max']) {
            if (oldSettings[key] !== undefined) rec[key] = oldSettings[key];
        }
    }
    GM_setValue(STORAGE_KEY, rec);

    const mobile = /mobile|android|iphone|ipad|touch/i.test(navigator.userAgent);
    const key = mobile ? 'ph' : 'pc';
    let limit = mobile ? rec.max_ph : rec.max_pc;
    let loopTimer = 0, ctdTimer = 0;
    let HOT = [];
    let startTime = Date.now();
    let currentTypeState = { ...BASE_TYPE };

    /* ===== 核心函数 ===== */
    function fluctuateTypingState() { const speedOffset = rand(-10, 15); currentTypeState.min = Math.max(20, BASE_TYPE.min + speedOffset); currentTypeState.max = BASE_TYPE.max + speedOffset; const errorOffset = (rand(-10, 20) / 1000); currentTypeState.error_chance = Math.max(0, Math.min(0.08, BASE_TYPE.error_chance + errorOffset)); }
    async function fetchHot() { for (const url of HOT_APIS) { try { const json = await new Promise((ok, err) => { GM_xmlhttpRequest({ method: 'GET', url, onload: ({ responseText }) => { try { ok(JSON.parse(responseText)); } catch (e) { err(e); } }, onerror: err }); }); HOT = parseHot(json); if (HOT.length) return; } catch (e) { console.error("BR Lite: Hotlist fetch failed for", url, e); } } HOT = FALL; }
    function parseHot(obj) { const words = []; const seen = new Set(); const isWord = s => typeof s === 'string' && s.trim().length > 0 && s.length <= 40; const skipRe = /^(微博|知乎|百度|抖音|36氪|哔哩哔哩|IT资讯|虎嗅网|豆瓣|人人都是产品经理|热搜|热榜|API)/; function add(s) { s = s.trim(); if (isWord(s) && !skipRe.test(s) && !seen.has(s)) { seen.add(s); words.push(s); } } function walk(v) { if (Array.isArray(v)) { v.forEach(walk); } else if (v && typeof v === 'object') { if (v.title) add(v.title); if (v.keyword) add(v.keyword); if (v.name) add(v.name); if (v.word) add(v.word); for (const k of ['list', 'hotList', 'data', 'hot', 'children', 'items']) { if (v[k]) walk(v[k]); } } } walk(obj?.data ?? obj); return words; }
    function startLoop() { if (rec[key] >= limit) { return stop(); } rec.running = true; if (rec.batch_count === 0) { rec.batch_count = 1; rec.current_batch_target = rand(rec.batch_size_min, rec.batch_size_max); } GM_setValue(STORAGE_KEY, rec); const runBtn = document.getElementById('run'); if (runBtn) runBtn.textContent = '暂停'; updateUI(); loop(); }
    function stop() { rec.running = false; rec.is_sleeping = false; tClr(loopTimer); iClr(ctdTimer); GM_setValue(STORAGE_KEY, rec); const runBtn = document.getElementById('run'); if (runBtn) runBtn.textContent = '启动'; updateUI(); }
    function toggle() { if (rec.running) { stop(); } else { startLoop(); } }
    function updateEstimate() { const estimateEl = document.getElementById('estimate'); if (!estimateEl) return; const searchesLeft = limit - rec[key]; if (searchesLeft <= 0) { estimateEl.textContent = '已完成'; return; } const avgBatchSize = (rec.batch_size_min + rec.batch_size_max) / 2; if (avgBatchSize <= 0) { estimateEl.textContent = '无效设置'; return; } const avgSearchMs = (rec.search_delay_min + rec.search_delay_max) / 2; const avgSleepMs = (rec.sleep_min + rec.sleep_max) / 2; const numBatchesLeft = Math.ceil(searchesLeft / avgBatchSize); const numSleepsLeft = Math.max(0, numBatchesLeft - 1); const totalMs = (searchesLeft * avgSearchMs) + (numSleepsLeft * avgSleepMs) + (searchesLeft * 4000); const totalMinutes = Math.round(totalMs / 60000); if (totalMinutes < 1) { estimateEl.textContent = '< 1 分钟'; } else { estimateEl.textContent = `约 ${totalMinutes} 分钟`; } }
    function updateUI(t = '--') { const panel = document.getElementById(ID); if (!panel) return; const elements = { sta: document.getElementById('sta'), ctd: document.getElementById('ctd'), num: document.getElementById('num'), limit: document.getElementById('limit'), batch_current: document.getElementById('batch_current'), batch_total: document.getElementById('batch_total'), batch_done: document.getElementById('batch_done'), searches_per_batch_display: document.getElementById('searches_per_batch_display'), fill: document.getElementById('fill'), time: document.getElementById('time') }; if (Object.values(elements).some(el => !el)) return; const avgBatchSize = (rec.batch_size_min + rec.batch_size_max) / 2 || 1; const totalBatches = Math.ceil(limit / avgBatchSize); elements.sta.textContent = rec.is_sleeping ? '休眠中' : (rec.running ? '运行中' : '已暂停'); elements.ctd.textContent = rec.running ? t : '--'; elements.num.textContent = rec[key]; elements.limit.textContent = limit; elements.batch_current.textContent = rec.batch_count; elements.batch_total.textContent = `~${totalBatches}`; elements.batch_done.textContent = rec.batch_searches_done; elements.searches_per_batch_display.textContent = rec.current_batch_target; elements.fill.style.transform = `scaleX(${limit > 0 ? Math.min(rec[key] / limit, 1) : 0})`; const d = Date.now() - startTime; elements.time.textContent = `${z2(Math.floor(d/36e5))}:${z2(Math.floor(d%36e5/6e4))}:${z2(Math.floor(d%6e4/1e3))}`; updateEstimate(); }
    const waitSearchDelay = () => Math.random() * (rec.search_delay_max - rec.search_delay_min) + rec.search_delay_min;
    const waitSleepDuration = () => Math.random() * (rec.sleep_max - rec.sleep_min) + rec.sleep_min;

    async function doSearch() {
        try {
            fluctuateTypingState();
            await new Promise(r => tSet(r, 600 + Math.random() * 1400));
            const baseKw = HOT[Math.random() * HOT.length | 0]; if (!baseKw) { console.error("BR Lite: No keyword found!"); return; }
            
            // --- 智能模板选择逻辑 ---
            let finalKw = baseKw;
            if (Math.random() < 0.85) { // 85%概率使用模板
                let applicableTemplates;
                // 如果关键词很长（大概率是句子），只使用通用模板
                if (baseKw.length > 15) {
                    applicableTemplates = UNIVERSAL_TEMPLATES;
                } else {
                // 如果关键词较短，使用所有模板
                    applicableTemplates = [...UNIVERSAL_TEMPLATES, ...CREATIVE_TEMPLATES];
                }
                const template = applicableTemplates[Math.random() * applicableTemplates.length | 0];
                finalKw = template.replace('[KW]', baseKw);
            }
            // 15%的概率直接搜索原始热词
            
            let inp = null; for (const sel of SELECTORS) { if (inp = document.querySelector(sel)) break; }
            if (inp) {
                inp.focus(); await new Promise(r => tSet(r, 200 + Math.random() * 500)); inp.value = '';
                for (const c of finalKw) {
                    inp.value += c; inp.dispatchEvent(new Event('input',{bubbles:true}));
                    if (Math.random() < currentTypeState.error_chance) {
                        const wrongChar = "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)];
                        inp.value += wrongChar; await new Promise(r => tSet(r, 150 + Math.random() * 200));
                        inp.value = inp.value.slice(0, -1); await new Promise(r => tSet(r, 100 + Math.random() * 150));
                    }
                    if (c === ' ') await new Promise(r => tSet(r, 120 + Math.random() * 150));
                    await new Promise(r => tSet(r, rand(currentTypeState.min, currentTypeState.max)));
                }
                ['keydown', 'keypress', 'keyup'].forEach(evt => inp.dispatchEvent(new KeyboardEvent(evt, {key:'Enter',keyCode:13,which:13,bubbles:true,cancelable:true})));
                inp.closest('form')?.submit();
                tSet(() => { if (location.pathname === '/' || location.pathname === '') location.href = `https://www.bing.com/search?q=${encodeURIComponent(finalKw)}`; }, 800);
            } else { location.href = `https://www.bing.com/search?q=${encodeURIComponent(finalKw)}`; }
            rec[key]++; rec.batch_searches_done++; GM_setValue(STORAGE_KEY, rec);
            const h = document.body.scrollHeight - innerHeight;
            if (h > 0) { const scroll = (y, t) => new Promise(r => tSet(() => { window.scrollTo({top:y, behavior:'smooth'}); r(); }, t)); const scrollPattern = Math.random(); if (scrollPattern < 0.4) { await scroll(h, 500 + Math.random() * 400); } else if (scrollPattern < 0.8) { await scroll(h * (0.3 + Math.random() * 0.2), 300 + Math.random() * 200); await scroll(h * (0.7 + Math.random() * 0.2), 400 + Math.random() * 300); await scroll(h, 500 + Math.random() * 300); } else { await scroll(h, 600 + Math.random() * 300); await new Promise(r => tSet(r, 200 + Math.random() * 300)); await scroll(h * (0.85 + Math.random() * 0.1), 300 + Math.random() * 200); } }
            if (Math.random() < 0.15) { await new Promise(r => tSet(r, 200 + Math.random() * 400)); document.documentElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); }
            await new Promise(r => tSet(r, rand(2000, 8000)));
            updateUI();
        } catch (e) { console.error('[BR]', e); stop(); }
    }

    function loop() { if (!rec.running || rec[key] >= limit) { return stop(); } const avgBatchSize = (rec.batch_size_min + rec.batch_size_max) / 2 || 1; const totalBatches = Math.ceil(limit / avgBatchSize); if (rec.is_sleeping) { const sleepTime = waitSleepDuration(); let c = Math.round(sleepTime / 1000); updateUI(c); ctdTimer = iSet(() => { if (!rec.running || !rec.is_sleeping) { iClr(ctdTimer); return; } updateUI(--c); }, 1000); loopTimer = tSet(() => { iClr(ctdTimer); rec.is_sleeping = false; rec.batch_searches_done = 0; rec.batch_count++; rec.current_batch_target = rand(rec.batch_size_min, rec.batch_size_max); GM_setValue(STORAGE_KEY, rec); loop(); }, sleepTime); } else { if (rec.batch_searches_done >= rec.current_batch_target) { if (rec.batch_count < totalBatches && rec[key] < limit) { rec.is_sleeping = true; GM_setValue(STORAGE_KEY, rec); loop(); } else { stop(); } return; } if (Math.random() < 0.05) { console.log("BR Lite: 模拟分心，跳过一次搜索。"); const w = waitSearchDelay(); let c = Math.round(w / 1000); updateUI(c); ctdTimer = iSet(() => { if (!rec.running || rec.is_sleeping) { iClr(ctdTimer); return; } updateUI(--c); }, 1000); loopTimer = tSet(async () => { iClr(ctdTimer); loop(); }, w); return; } const w = waitSearchDelay(); let c = Math.round(w / 1000); updateUI(c); ctdTimer = iSet(() => { if (!rec.running || rec.is_sleeping) { iClr(ctdTimer); return; } updateUI(--c); }, 1000); loopTimer = tSet(async () => { iClr(ctdTimer); await doSearch(); loop(); }, w); } }

    /* ===== 面板UI及事件绑定 ===== */
    function buildPanel() { if (document.getElementById(ID)) return; const box = document.createElement('div'); box.id = ID; box.innerHTML = ` <div id="drag" style="display:flex;justify-content:space-between;cursor:move;padding-bottom:4px"><b>BR Lite</b><div><button id="run">${rec.running ? '暂停' : '启动'}</button><button id="clr">清零</button></div></div> <div> <div>模式：<b>${mobile ? '手机' : '桌面'}</b></div> <div>状态：<b id="sta"></b></div> <div>下次：<b id="ctd"></b>s</div> <div>计数：<span id="num"></span>/<span id="limit"></span></div> <div>轮次: <span id="batch_current"></span>/<span id="batch_total"></span> (<span id="batch_done"></span>/<span id="searches_per_batch_display"></span>)</div> <div class="bar"><div class="fill" id="fill"></div></div> <div style="font-size:9px">运行：<span id="time"></span></div> <div style="font-size:9px">预计剩余：<span id="estimate">--</span></div> </div> <div id="settings" style="margin-top:6px;padding-top:6px;border-top:1px solid #eee; font-size:10px;"> <div><label>总次数 <input type="number" id="total_searches" value="${limit}"></label></div> <div style="margin-top:4px;"><label>每轮次数 <input type="number" id="batch_size_min" value="${rec.batch_size_min}"> - <input type="number" id="batch_size_max" value="${rec.batch_size_max}"></label></div> <div style="margin-top:4px;"><label>搜索间隔(秒) <input type="number" id="search_delay_min" value="${rec.search_delay_min / 1000}"> - <input type="number" id="search_delay_max" value="${rec.search_delay_max / 1000}"></label></div> <div style="margin-top:4px;"><label>轮次休眠(分) <input type="number" id="sleep_min" value="${rec.sleep_min / 60000}"> - <input type="number" id="sleep_max" value="${rec.sleep_max / 60000}"></label></div> <div style="margin-top:6px;"><button id="save">保存设置</button></div> </div> <div style="font-size:9px;text-align:right">v${VER}</div>`; document.body.appendChild(box); const drag = document.getElementById('drag'); let d = false, sx = 0, sy = 0, lx = 0, ly = 0; drag.onmousedown = e => { if (e.button !== 0) return; d = true; sx = e.clientX; sy = e.clientY; lx = box.offsetLeft; ly = box.offsetTop; document.onmousemove = ev => { if (!d) return; box.style.left = (lx + ev.clientX - sx) + 'px'; box.style.top = (ly + ev.clientY - sy) + 'px'; }; document.onmouseup = () => { d = false; document.onmousemove = document.onmouseup = null; }; }; drag.ontouchstart = e => { d = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; lx = box.offsetLeft; ly = box.offsetTop; document.ontouchmove = ev => { if (!d) return; box.style.left = (lx + ev.touches[0].clientX - sx) + 'px'; box.style.top = (ly + ev.touches[0].clientY - sy) + 'px'; }; document.ontouchend = () => { d = false; document.ontouchmove = document.ontouchend = null; }; }; document.getElementById('run').onclick = toggle; document.getElementById('clr').onclick = () => { stop(); rec = { ...rec, pc: 0, ph: 0, batch_count: 1, batch_searches_done: 0 }; startTime = Date.now(); rec.current_batch_target = rand(rec.batch_size_min, rec.batch_size_max); GM_setValue(STORAGE_KEY, rec); updateUI(); }; document.getElementById('save').onclick = () => { const wasRunning = rec.running; if (wasRunning) stop(); const getVal = (id, fallback) => parseInt(document.getElementById(id).value) || fallback; const total = getVal('total_searches', limit); if (mobile) { rec.max_ph = total; } else { rec.max_pc = total; } rec.batch_size_min = getVal('batch_size_min', rec.batch_size_min); rec.batch_size_max = getVal('batch_size_max', rec.batch_size_max); if (rec.batch_size_min < 1) rec.batch_size_min = 1; if (rec.batch_size_max < rec.batch_size_min) rec.batch_size_max = rec.batch_size_min; rec.search_delay_min = getVal('search_delay_min', rec.search_delay_min / 1000) * 1000; rec.search_delay_max = getVal('search_delay_max', rec.search_delay_max / 1000) * 1000; rec.sleep_min = getVal('sleep_min', rec.sleep_min / 60000) * 60000; rec.sleep_max = getVal('sleep_max', rec.sleep_max / 60000) * 60000; limit = total; if (wasRunning) { rec.batch_searches_done = 0; rec.batch_count = 1; rec.current_batch_target = rand(rec.batch_size_min, rec.batch_size_max); } GM_setValue(STORAGE_KEY, rec); const saveBtn = document.getElementById('save'); if (saveBtn) { saveBtn.textContent = '已保存'; tSet(() => saveBtn.textContent = '保存设置', 1500); } updateUI(); if (wasRunning) startLoop(); }; }

    /* ===== 页面加载 ===== */
    (async function () { GM_addStyle(`#${ID}{position:fixed;top:10px;right:10px;z-index:99999;width:200px;padding:10px;font:11px system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#222;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1);}#${ID} button{font-size:10px;background:#007bff;color:#fff;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;}#${ID} input[type="number"]{width:40px;font-size:10px;border:1px solid #ccc;border-radius:4px;padding:2px;}#${ID} input[type="checkbox"]{vertical-align:middle;margin-right:2px;}.bar{height:4px;background:#ddd;border-radius:2px;}.fill{height:100%;background:#007bff;transform-origin:left;transition:transform .3s;}`); function initScript() { buildPanel(); setTimeout(() => { updateUI(); if (rec.running) startLoop(); }, 200); } await fetchHot(); if (document.readyState === 'complete' || document.readyState === 'interactive') { initScript(); } else { window.addEventListener('load', initScript, { once: true }); } })();
})();