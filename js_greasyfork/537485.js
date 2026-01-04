// ==UserScript==
// @name         东软it挂挂挂 Plus+
// @namespace    zhangyisuidrzhpt
// @version      1.3
// @description  自动跳过并播放下一节，带自动静音开关及最近观看记录面板（最多5条）
// @author       Youko
// @match        https://study.neutech.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537485/%E4%B8%9C%E8%BD%AFit%E6%8C%82%E6%8C%82%E6%8C%82%20Plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/537485/%E4%B8%9C%E8%BD%AFit%E6%8C%82%E6%8C%82%E6%8C%82%20Plus%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // —— 配置 ——
    const HISTORY_KEY = 'videoHelperHistory'; // 本地存储键

    // —— 状态 ——
    let autoAdvanceEnabled = true;
    let autoMuteEnabled = true;
    let watchHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

    // —— 工具函数 ——
    function saveHistory() {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(watchHistory.slice(0, 5)));
    }
    function addToHistory(title) {
        if (!title) return;
        // 去重、保持最新在前
        watchHistory = [title].concat(watchHistory.filter(t => t !== title));
        watchHistory = watchHistory.slice(0, 5);
        saveHistory();
        renderHistory();
    }

    // —— UI 构建 ——
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed', bottom: '10px', right: '10px',
        zIndex: '10000', background: '#000', color: '#fff',
        padding: '8px', borderRadius: '4px', fontSize: '14px',
        width: '200px'
    });

    // 切换按钮：自动跳转
    const btnAdvance = document.createElement('button');
    btnAdvance.textContent = '跳转：开';
    Object.assign(btnAdvance.style, {
        width: '48%', marginRight: '2%', padding: '4px'
    });
    btnAdvance.onclick = () => {
        autoAdvanceEnabled = !autoAdvanceEnabled;
        btnAdvance.textContent = `跳转：${autoAdvanceEnabled? '开':'关'}`;
        console.log('[视频助手] 自动跳转已', autoAdvanceEnabled?'启用':'禁用');
    };
    panel.appendChild(btnAdvance);

    // 切换按钮：自动静音
    const btnMute = document.createElement('button');
    btnMute.textContent = '静音：开';
    Object.assign(btnMute.style, {
        width: '48%', padding: '4px', marginBottom: '6px'
    });
    btnMute.onclick = () => {
        autoMuteEnabled = !autoMuteEnabled;
        btnMute.textContent = `静音：${autoMuteEnabled? '开':'关'}`;
        console.log('[视频助手] 自动静音已', autoMuteEnabled?'启用':'禁用');
    };
    panel.appendChild(btnMute);

    // 历史记录面板头
    const histHeader = document.createElement('div');
    histHeader.textContent = '▶ 最近观看';
    Object.assign(histHeader.style, {
        cursor: 'pointer', userSelect: 'none', marginBottom: '4px'
    });
    panel.appendChild(histHeader);

    // 历史列表
    const histList = document.createElement('ul');
    Object.assign(histList.style, {
        listStyle: 'none', padding: '0', margin: '0', display: 'none',
        maxHeight: '120px', overflowY: 'auto'
    });
    panel.appendChild(histList);

    histHeader.onclick = () => {
        const showing = histList.style.display === 'block';
        histList.style.display = showing ? 'none' : 'block';
        histHeader.textContent = (showing ? '▶' : '▼') + ' 最近观看';
    };

    document.body.appendChild(panel);

    function renderHistory() {
        histList.innerHTML = '';
        watchHistory.forEach(title => {
            const li = document.createElement('li');
            li.textContent = title;
            li.style.padding = '2px 0';
            histList.appendChild(li);
        });
    }
    renderHistory();


    // —— 视频处理 ——
    const processed = new WeakSet();

    function getVideoTitle() {
        const el = document.querySelector(
            '#app > div > div.main-container > div > div.course-learning > div.course-learning-top > div.course-learning-main > div.course-learning-right > div > div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > div > div > div:nth-child(2) > div.task-row > div.active.task-col > div.task-item.link-learning > div > span:nth-child(2) > span.text-eclipse'
        );
        return el?.innerText.trim() || '';
    }

    function waitForMetadata(media) {
        return new Promise(res => {
            if (media.readyState >= 1) res();
            else media.addEventListener('loadedmetadata', res, { once: true });
        });
    }

    async function processMedia(media) {
        if (processed.has(media)) return;
        processed.add(media);

        // 记录标题
        addToHistory(getVideoTitle());

        // 自动静音
        if (autoMuteEnabled) media.muted = true;

        await waitForMetadata(media);
        try { await media.play(); }
        catch(e){ console.log('[视频助手] 自动播放失败:', e); }

        media.addEventListener('ended', () => {
            console.log('[视频助手] 视频播放结束');
            if (autoAdvanceEnabled) clickNextAndPlay();
        }, { once: true });
    }

    function clickNextAndPlay() {
        const xpath = '/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div/div/div[4]/div/span[2]/div/div[1]';
        const btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!btn) {
            console.log('[视频助手] 未找到“下一节”按钮');
            return;
        }
        btn.click();
        console.log('[视频助手] 已点击“下一节”');

        // 等待新视频加载
        setTimeout(() => {
            document.querySelectorAll('video').forEach(v => {
                if (!processed.has(v)) {
                    if (autoMuteEnabled) v.muted = true;
                    v.play().then(() => console.log('[视频助手] 下一节自动播放')).catch(()=>{});
                    v.addEventListener('ended', () => {
                        if (autoAdvanceEnabled) clickNextAndPlay();
                    }, { once: true });
                }
            });
        }, 2000);
    }

    function scanForMedia() {
        document.querySelectorAll('video').forEach(processMedia);
    }

    // 初次扫描
    scanForMedia();
    // 动态监测
    new MutationObserver(scanForMedia).observe(document.body, { childList: true, subtree: true });
    // 定时备份
    setInterval(scanForMedia, 3000);

})();
