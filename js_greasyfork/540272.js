// ==UserScript==
// @name         Kanshuv 小说批量采集V2（断点续传 + 自定义页数）
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  支持多 type、并发上传、断点续传、页数范围设置
// @match        *://kanshuv.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540272/Kanshuv%20%E5%B0%8F%E8%AF%B4%E6%89%B9%E9%87%8F%E9%87%87%E9%9B%86V2%EF%BC%88%E6%96%AD%E7%82%B9%E7%BB%AD%E4%BC%A0%20%2B%20%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A1%B5%E6%95%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540272/Kanshuv%20%E5%B0%8F%E8%AF%B4%E6%89%B9%E9%87%8F%E9%87%87%E9%9B%86V2%EF%BC%88%E6%96%AD%E7%82%B9%E7%BB%AD%E4%BC%A0%20%2B%20%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A1%B5%E6%95%B0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /********** ① 可自行调整的配置 **********/
    const saveUrl  = 'https://zs.0km.cc/kanshu/save_data.php';
    const typeList = [4,5,6,7,8,9,10,11,12,13,14,15,25,27,28,29,30,31,32,33,34,35,
                      36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54];
    const pageSize = 1000;                // 每页拉取条数 (接口稳定)
    const batch    = 100;                 // 每批并发上传条数
    /*****************************************/

    const STORE_KEY = 'kanshu_state_v1';

    let state = {
        running   : false,
        typeIdx   : 0,
        page      : 1,
        startPage : 1,
        endPage   : 0
    };

    /* ---------- UI 面板 ---------- */
    const panel = document.createElement('div');
    panel.innerHTML = `
      <div style="position:fixed;top:20px;right:20px;z-index:99999;
                  background:#fff;border:1px solid #ccc;padding:10px;
                  box-shadow:0 0 5px rgba(0,0,0,.2);font-size:14px;">
        <div style="margin-bottom:6px;">
          起始页 <input id="startPage" type="number" value="1" style="width:60px;">
          结束页 <input id="endPage"   type="number" value="0" style="width:60px;">
          <small>(0=全部)</small>
        </div>
        <button id="startBtn">▶ 开始采集</button>
        <button id="resumeBtn" style="display:none;">⏯ 恢复任务</button>
        <button id="pauseBtn" disabled>⏸ 暂停</button>
        <div id="progress" style="margin-top:8px;">状态：待开始</div>
      </div>`;
    document.body.appendChild(panel);

    /* ---------- 断点恢复 ---------- */
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
        const s = JSON.parse(saved);
        if (s.running) {
            state = s;
            $('#resumeBtn').style.display = '';
            setText(`检测到未完成任务，可点击“恢复任务”继续 (type=${typeList[s.typeIdx]} 第 ${s.page} 页)…`);
        }
    }

    /* ---------- 绑定事件 (防重复) ---------- */
    if (!$('#startBtn').dataset.bind) {
        $('#startBtn').dataset.bind = '1';
        $('#startBtn').onclick  = onStart;
        $('#resumeBtn').onclick = onResume;
        $('#pauseBtn').onclick  = onPause;
    }

    /* ---------- 函数定义 ---------- */
    async function run() {
        console.log('[RUN] 任务开始');
        const seenIds = new Set();

        while (state.running && state.typeIdx < typeList.length) {
            const type = typeList[state.typeIdx];
            let maxPages = Infinity;

            while (state.running &&
                   (state.endPage === 0 || state.page <= state.endPage) &&
                   state.page <= maxPages) {

                setText(`type=${type} 第 ${state.page} 页采集中…`);
                const apiUrl =
                  `https://kanshuv.com/api/changkan/portal/novel/list?type=${type}&pageNo=${state.page}&pageSize=${pageSize}`;

                let json;
                try {
                    json = await (await fetch(apiUrl)).json();
                    console.log(`[API] type=${type} page=${state.page} ->`, json);
                } catch (e) {
                    setText('接口请求失败，已暂停');
                    console.error(e);
                    pauseInternal();
                    return;
                }

                if (!(json.success && json.result && Array.isArray(json.result.records))) {
                    setText('接口结构异常，跳过该页');
                    break;
                }

                const records = json.result.records;
                maxPages = json.result.pages || maxPages;

                if (records.length === 0) break;

                // 分批并发上传
                for (let i = 0; i < records.length && state.running; i += batch) {
                    const chunk = records.slice(i, i + batch);
                    await Promise.all(
                        chunk.map(item => uploadItem(item, type, seenIds))
                    );
                    await delay(rand(100, 300));
                }

                state.page++;
                saveState();
            }

            state.typeIdx++;
            state.page = state.startPage;
            saveState();
        }

        if (state.running) setText('✅ 所有类型采集完成');
        pauseInternal(false);
    }

    async function uploadItem(item, type, seenSet) {
        if (seenSet.has(item.id)) return;
        seenSet.add(item.id);

        const postData = {
            id         : item.id,
            name       : item.name,
            filePath   : item.filePath,
            updateTime : item.updateTime || item.createTime,
            author     : item.author || '',
            typeId     : type
        };

        try {
            const res = await (await fetch(saveUrl, {
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body   : JSON.stringify(postData)
            })).json();
            console.log('✔ 上传成功', postData.id, res);
        } catch (e) {
            console.error('✘ 上传失败', postData.id, e);
        }
    }

    /* ---------- 事件处理 ---------- */
    function onStart() {
        console.log('[UI] 点击开始采集');
        state.startPage = int($('#startPage').value, 1);
        state.endPage   = int($('#endPage').value, 0);
        state.typeIdx   = 0;
        state.page      = state.startPage;
        state.running   = true;
        saveState();
        $('#pauseBtn').disabled = false;
        $('#startBtn').disabled = true;
        $('#resumeBtn').style.display = 'none';
        run();
    }

    function onResume() {
        console.log('[UI] 恢复任务');
        state.running = true;
        saveState();
        $('#pauseBtn').disabled = false;
        $('#startBtn').disabled = true;
        $('#resumeBtn').style.display = 'none';
        run();
    }

    function onPause() {
        console.log('[UI] 手动暂停');
        pauseInternal(true);
    }

    /* ---------- 工具 ---------- */
    function pauseInternal(showResume) {
        state.running = false;
        saveState();
        $('#pauseBtn').disabled = true;
        $('#startBtn').disabled = false;
        if (showResume) $('#resumeBtn').style.display = '';
        setText(`已暂停 (type=${typeList[state.typeIdx] || '-'} 第 ${state.page} 页)`);
    }

    function $(sel)             { return document.getElementById(sel.slice(1)) || document.querySelector(sel); }
    function delay(ms)          { return new Promise(r => setTimeout(r, ms)); }
    function rand(min, max)     { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function int(v, d)          { const n = parseInt(v); return isNaN(n) ? d : n; }
    function setText(t)         { $('#progress').innerText = t; }
    function saveState()        { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
})();
