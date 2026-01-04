// ==UserScript==
// @name         全局动画搜索与追番助手
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  🎯 专业动画追番神器！一键搜索动画资源，智能收藏管理，个性化追番体验。快捷键说明：[Shift+F]呼出搜索 | [Shift+C]收藏当前动画 | [Shift+D]管理收藏夹
// @author       Aomine
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='0' y='24' font-size='24'>🔍 </text></svg>
// @license      GPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541976/%E5%85%A8%E5%B1%80%E5%8A%A8%E7%94%BB%E6%90%9C%E7%B4%A2%E4%B8%8E%E8%BF%BD%E7%95%AA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541976/%E5%85%A8%E5%B1%80%E5%8A%A8%E7%94%BB%E6%90%9C%E7%B4%A2%E4%B8%8E%E8%BF%BD%E7%95%AA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建搜索框HTML结构
    const searchHTML = `
    <div id="search-overlay"></div>
    <div id="global-search-container">
        <div class="search-header">
            <h2 class="search-title">动画资源搜索</h2>
            <button class="close-btn">&times;</button>
        </div>
        <div class="search-input-group">
            <input type="text" id="search-input" placeholder="输入动画名称..." autocomplete="off">
            <button id="search-btn">
                <svg class="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </button>
        </div>
        <div class="engine-selector">
            <label class="engine-label">选择搜索引擎：</label>
            <select id="engine-select">
                <option value="0">次元城动画</option>
                <option value="1">稀饭动漫</option>
                <option value="2">番薯动漫</option>
                <option value="3">咕咕番</option>
                <option value="4">MuteFun</option>
                <option value="5">NT动漫</option>
                <option value="6">风铃动漫</option>
                <option value="7">喵物次元</option>
                <option value="8">Bangumi评分</option>
            </select>
        </div>
        <div class="search-footer">
            按 <span class="search-hotkey">ESC</span> 关闭 | 按 <span class="search-hotkey">Enter</span> 搜索
        </div>
    </div>
    `;

    // 创建CSS样式
    const css = `
    #global-search-container {
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999999;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 20px;
        width: 550px;
        max-width: 90%;
        display: none;
        animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    #search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
        z-index: 999998;
        display: none;
    }

    @keyframes pop-in {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        100% { opacity: 1; transform: translate(-50%, 0); }
    }

    .search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .search-title {
        font-size: 20px;
        font-weight: 600;
        color: #2c3e50;
        margin: 0;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #7f8c8d;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: #e74c3c;
    }

    .search-input-group {
        display: flex;
        margin-bottom: 15px;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    #search-input {
        flex: 1;
        padding: 15px 20px;
        border: none;
        outline: none;
        font-size: 16px;
        background: #f8f9fa;
        color: #000000 !important;
        caret-color: #3498db !important;
    }

    #search-btn {
        background: #3498db;
        border: none;
        padding: 0 25px;
        cursor: pointer;
        transition: background 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #search-btn:hover {
        background: #2980b9;
    }

    .search-icon {
        width: 22px;
        height: 22px;
        fill: white;
    }

    .engine-selector {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
    }

    .engine-label {
        font-size: 14px;
        margin-bottom: 8px;
        color: #34495e;
        font-weight: 500;
    }

    #engine-select {
        padding: 12px 15px;
        border-radius: 8px;
        border: 1px solid #ddd;
        background: #f8f9fa;
        font-size: 15px;
        outline: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        width: 100%;
    }

    #engine-select:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .search-footer {
        margin-top: 15px;
        font-size: 13px;
        color: #7f8c8d;
        text-align: center;
        padding-top: 10px;
        border-top: 1px solid #eee;
    }

    .search-hotkey {
        background: #f1f2f6;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
    }
    `;

    // 将样式和HTML添加到文档
    document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
    document.body.insertAdjacentHTML('beforeend', searchHTML);

    // 搜索引擎列表
    const searchEngines = [
        {
            name: "次元城动画",
            url: "https://www.cycani.org/search.html?wd=${name}"
        },
        {
            name: "稀饭动漫",
            url: "https://dm.xifanacg.com/search.html?wd=${name}"
        },
        {
            name: "番薯动漫",
            url: "https://www.fsdm02.com/vodsearch/-------------.html?wd=${name}"
        },
        {
            name: "咕咕番",
            url: "https://www.gugu3.com/index.php/vod/search.html?wd=${name}"

        },
        {
            name: "MuteFun",
            url: "https://www.mutean.com/vodsearch/${name}-------------.html"
        },
        {
            name: "NT动漫",
            url: "http://www.ntdm8.com/search/-------------.html?wd=${name}&page=1"
        },
        {
            name: "风铃动漫",
            url: "https://www.aafun.cc/feng-s.html?wd=${name}"
        },
        {
            name: "喵物次元",
            url: "https://www.mwcy.net/search.html?wd=${name}"
        },
        {
            name: "Bangumi评分",
            url: "https://bgm.tv/subject_search/${name}?cat=2"
        }
    ];

    // 获取DOM元素
    const searchContainer = document.getElementById('global-search-container');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const engineSelect = document.getElementById('engine-select');
    const closeBtn = document.querySelector('.close-btn');

    // 显示搜索框
    function showSearch() {
        searchContainer.style.display = 'block';
        searchOverlay.style.display = 'block';
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    }

    // 隐藏搜索框
    function hideSearch() {
        searchContainer.style.display = 'none';
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        document.body.style.overflow = '';
    }

    // 执行搜索
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        const selectedEngine = searchEngines[engineSelect.value];
        const encodedTerm = encodeURIComponent(searchTerm);
        const searchUrl = selectedEngine.url.replace('${name}', encodedTerm);

        window.open(searchUrl, '_blank');
        hideSearch();
    }

    // 事件监听
    document.addEventListener('keydown', function(e) {
        // Shift + F 打开搜索框
        if (e.shiftKey && e.key === 'F') {
            e.preventDefault();
            showSearch();
        }

        // ESC 关闭搜索框
        if (e.key === 'Escape' && searchContainer.style.display === 'block') {
            hideSearch();
        }

        // 在搜索框中按Enter搜索
        if (e.key === 'Enter' && document.activeElement === searchInput && searchContainer.style.display === 'block') {
            performSearch();
        }
    });

    searchBtn.addEventListener('click', performSearch);
    closeBtn.addEventListener('click', hideSearch);
    searchOverlay.addEventListener('click', hideSearch);
})();


(function () {
    'use strict';

    /* ========================= 白名单配置 ========================= */
    const whitelist = [
        "https://www.gugu3.com/index.php/vod/play/id",
        "https://www.fsdm02.com/vodplay",
        "https://www.ntdm8.com/play",
        "https://www.cycani.org/watch",
        "https://dm.xifanacg.com/watch",
        "https://www.aafun.cc/f",
        "https://www.mwcy.net/play",
        "https://www.mutean.com/vodplay",
    ];

    const STORAGE_KEY = 'anime_favorites_v2';
    const POS_KEY = 'anime_fav_panel_pos_v2';
    const NOISE_WORDS = [
        '免费在线观看','在线观看','高清','超清','原声','全集','无广告','在线播放',
        '高清版','未删减','官方','官网','弹幕','字幕','BT','迅雷','下载','观看'
    ];

    /* ========================= Title 捕获 ========================= */
    let currentTitle = (function() {
        try {
            let tnode = document.querySelector && document.querySelector('title');
            return (tnode && tnode.textContent || document.title || '').trim();
        } catch(e) {
            return document.title || '';
        }
    })();

    const titleObserver = new MutationObserver(() => {
        currentTitle = document.title;
    });

    const tNode = document.querySelector('title');
    if(tNode) {
        titleObserver.observe(tNode, { subtree: true, characterData: true, childList: true });
    }

    /* ========================= 数据存储 ========================= */
    function getFavorites() {
        try { return JSON.parse(GM_getValue(STORAGE_KEY, '[]')); }
        catch(e) { return []; }
    }

    function saveFavorites(list) {
        GM_setValue(STORAGE_KEY, JSON.stringify(list));
    }

    function savePanelPos(pos) {
        GM_setValue(POS_KEY, JSON.stringify(pos));
    }

    function loadPanelPos() {
        try { return JSON.parse(GM_getValue(POS_KEY, 'null')); }
        catch(e) { return null; }
    }

    /* ========================= 标题处理 ========================= */
    function cleanRawTitle(t) {
        if(!t) return '';
        t = t.replace(/【.*?】|\[.*?\]|\(.*?\)|（.*?）/g, '');
        NOISE_WORDS.forEach(w => { t = t.replace(new RegExp(w,'gi'), ''); });
        t = t.replace(/\s*[-|＿|—|–|_]\s*[^-_|—–_]{1,50}$/g, '');
        t = t.replace(/\s+/g, ' ').trim();
        return t;
    }

    function extractSeriesAndEpisode(rawTitle) {
        const t = cleanRawTitle(rawTitle || '');
        let m = t.match(/(.+?)\s*(第[\d一二三四五六七八九十百千]+[集话回])/i);
        if(m) return { full: t, series: m[1].trim(), episode: m[2].trim() };
        return { full: t, series: t.trim(), episode: '' };
    }

    function normalizeSeriesName(name) {
        return (name||'').replace(/\s+/g,'').replace(/[^\w\u4e00-\u9fa5]/g,'').toLowerCase();
    }

    function getCurrentTitle() { return currentTitle || document.title || ''; }

    /* ========================= 创建UI ========================= */
    const panel = document.createElement('div');
    panel.id = 'animeFavPanel';
    panel.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        width: 320px;
        max-height: 72vh;
        overflow: hidden;
        background: rgba(255,255,255,0.96);
        border: 1px solid rgba(0,0,0,0.12);
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        padding: 8px;
        font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;
        font-size: 13px;
        color: #111;
        display: none;
        z-index: 2147483646;
        user-select: none;
    `;
    document.body.appendChild(panel);

    // header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 4px;
        cursor: grab;
    `;

    const titleText = document.createElement('strong');
    titleText.innerHTML = `
         <svg style="width:16px;height:16px;vertical-align:text-bottom;margin-right:4px;fill:#e74c3c;" viewBox="0 0 24 24">
             <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
         </svg> 我的收藏`;
    header.appendChild(titleText);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.style.cssText = `
        border: none;
        background: transparent;
        color: #888;
        font-size: 14px;
        cursor: pointer;
        padding: 2px 6px;
    `;
    closeBtn.onclick = () => { panel.style.display = 'none'; };
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // list
    const listWrap = document.createElement('div');
    listWrap.style.cssText = `
        overflow: auto;
        max-height: 56vh;
        padding-right: 6px;
    `;

    const list = document.createElement('div');
    list.id = 'animeFavList';
    list.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 6px;
    `;

    listWrap.appendChild(list);
    panel.appendChild(listWrap);

    // footer
    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 6px 4px;
        border-top: 1px solid rgba(0,0,0,0.04);
        font-size: 12px;
        color: #666;
    `;
    footer.innerHTML = `
        <div>快捷键：</div>
        <ul style="margin:4px 0;padding-left:18px;">
            <li>Shift+C 显示/隐藏收藏栏</li>
            <li>Shift+D 收藏当前番剧（仅白名单页）</li>
        </ul>
    `;
    panel.appendChild(footer);

    /* ========================= 拖动功能 ========================= */
    (function makeDraggable(handle, target) {
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        handle.addEventListener('mousedown', e => {
            if (e.button !== 0) return;

            dragging = true;
            startX = e.clientX;
            startY = e.clientY;

            if (!target.style.left) target.style.left = target.getBoundingClientRect().left + 'px';
            startLeft = parseFloat(target.style.left);
            startTop = parseFloat(target.style.top || target.getBoundingClientRect().top);

            target.style.right = 'auto';

            //在document上强制设置鼠标样式
            document.body.style.cursor = 'grabbing';
            handle.style.cursor = 'grabbing';

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            e.preventDefault();
        });

        function onMove(e) {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const newLeft = Math.max(6, Math.min(window.innerWidth - target.offsetWidth - 6, startLeft + dx));
            const newTop = Math.max(6, Math.min(window.innerHeight - target.offsetHeight - 6, startTop + dy));

            target.style.left = newLeft + 'px';
            target.style.top = newTop + 'px';
        }

        function onUp() {
            dragging = false;

            //拖动结束时恢复默认鼠标样式
            document.body.style.cursor = '';
            handle.style.cursor = 'grab';

            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            savePanelPos({ left: parseFloat(target.style.left), top: parseFloat(target.style.top) });
        }
    })(header, panel);
    /* ========================= 渲染收藏列表 ========================= */

    // 获取网站名称的辅助函数
    function getSiteNameByUrl(url) {
        const defaultName = "未知来源";
        const engines = [
            { name: "次元城动画", url: "https://www.cycani.org" },
            { name: "稀饭动漫", url: "https://dm.xifanacg.com" },
            { name: "番薯动漫", url: "https://www.fsdm02.com" },
            { name: "MuteFun", url: "https://www.mutean.com" },
            { name: "咕咕番", url: "https://www.gugu3.com" },
            { name: "NT动漫", url: "http://www.ntdm8.com" },
            { name: "风铃动漫", url: "https://www.bbfun.cc" },
            { name: "喵物次元", url: "https://www.mwcy.net" }
        ];

        for (const engine of engines) {
            if (url.startsWith(engine.url)) {
                return engine.name;
            }
        }
        return defaultName;
    }

    function renderList() {
        list.innerHTML = '';
        const data = getFavorites();
        data.sort((a, b) => (b.ts || 0) - (a.ts || 0));
        data.forEach((item, idx) => {
            const row = document.createElement('div');
            row.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px;
            border-radius: 8px;
        `;

            const left = document.createElement('div');
            left.style.cssText = `
            flex: 1;
            min-width: 0;
        `;

            const a = document.createElement('a');
            a.textContent = item.title;
            a.href = item.url;
            a.target = '_blank';
            a.title = item.title;
            a.style.cssText = `
            display: block;
            text-decoration: none;
            color: #111;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

            const meta = document.createElement('div');
            const siteName = getSiteNameByUrl(item.url);
            const timestamp = item.ts ? (new Date(item.ts)).toLocaleString() : '';
            meta.textContent = `[${siteName}] ${timestamp}`;
            meta.style.cssText = `
            font-size: 11px;
            color: #777;
            margin-top: 4px;
        `;

            left.appendChild(a);
            left.appendChild(meta);

            const btns = document.createElement('div');
            btns.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-left: 8px;
        `;

            const del = document.createElement('button');
            del.textContent = '删除';
            del.style.cssText = `
            border: none;
            background: #e24;
            color: #fff;
            padding: 4px 8px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        `;
            del.onclick = () => {
                const arr = getFavorites();
                arr.splice(idx, 1);
                saveFavorites(arr);
                renderList();
            };

            btns.appendChild(del);
            row.appendChild(left);
            row.appendChild(btns);
            list.appendChild(row);
        });
    }
    /* ========================= 收藏功能 ========================= */

    // 辅助函数：提取番剧的唯一标识URL
    function getAnimeBaseUrl(fullUrl) {
        let url = fullUrl.split('?')[0]; // 去掉 ? 后面的参数

        // 1. 适配 "咕咕番" 等关键字结构 (.../id/1234/sid/1/nid/1.html)
        // 提取到 /id/xxxx 为止
        if (url.includes('/id/')) {
            const match = url.match(/(.*?\/id\/\d+)/);
            if (match) return match[1];
        }

        // 2. 适配 "NT动漫/番薯/MuteFun" 等横杠结构 (.../vodplay/1234-1-1.html)
        // 去掉末尾的 -1-1.html 或 -1.html
        if (/-\d+(-\d+)?\.html$/.test(url)) {
            return url.replace(/-\d+(-\d+)?\.html$/, '');
        }

        // 3. 适配 "稀饭/次元城" 等斜杠结构 (.../watch/1234/1/1.html 或 /watch/1234/1.html)
        // 去掉末尾的 /1/1.html 或 /1.html
        // 正则解释：匹配末尾的 (/数字)+.html 并去掉
        if (/\/\d+(\/\d+)?\.html$/.test(url)) {
            return url.replace(/\/\d+(\/\d+)?\.html$/, '');
        }

        // 4. 如果以上都没匹配到，去掉末尾的数字部分兜底
        return url.replace(/(\/|-)\d+\.html$/, '');
    }

    function urlInWhitelist(url) {
        return whitelist.some(w => url.startsWith(w));
    }
    function collectCurrentPage() {
        if (!urlInWhitelist(location.href)) {
            alert('当前页面不在收藏白名单，无法收藏');
            return;
        }

        const url = location.href;
        const parsed = extractSeriesAndEpisode(getCurrentTitle());
        // 构造新标题
        const newTitle = parsed.episode ? `${parsed.series} ${parsed.episode}` : parsed.full;
        const newSeriesNorm = normalizeSeriesName(parsed.series);

        // 计算当前页面的 URL 主干 (例如 https://.../watch/1234)
        const currentBaseUrl = getAnimeBaseUrl(url);

        let arr = getFavorites();
        let idx = -1;

        // 【步骤1】 优先尝试通过番剧名精确匹配
        idx = arr.findIndex(it => normalizeSeriesName(extractSeriesAndEpisode(it.title).series) === newSeriesNorm);

        // 【步骤2】 如果名字没匹配到，使用你想要的 URL 主干相似性匹配
        if (idx === -1) {
            idx = arr.findIndex(it => {
                // 计算收藏夹中该条目的 URL 主干
                const itBase = getAnimeBaseUrl(it.url);
                // 只有当两个主干长度足够长（避免误判首页）且相等时，才视为同一番剧
                return itBase.length > 15 && itBase === currentBaseUrl;
            });
        }

        if (idx > -1) {
            const existing = arr[idx];

            // 如果完全是同一个链接，提示已存在
            if (existing.url === url) {
                alert('该页面已收藏，无需重复添加：\n' + newTitle);
                return;
            }

            // 触发覆盖更新逻辑
            if (confirm(`检测到同系列收藏更新！\n\n原进度：${existing.title}\n新进度：${newTitle}\n\n是否覆盖？`)) {
                arr.splice(idx, 1, { title: newTitle, url, ts: Date.now() });
                saveFavorites(arr);
                renderList();
                // 视觉反馈
                panel.style.display = 'block';
            }
            return;
        }

        // 新收藏
        if (!arr.some(it => it.url === url)) {
            arr.unshift({ title: newTitle, url, ts: Date.now() });
            saveFavorites(arr);
            renderList();
            alert('已收藏：' + newTitle);
        }
    }
    /* ========================= 快捷键 ========================= */
    document.addEventListener('keydown', e => {
        const tgt = e.target;
        const isTyping = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
        if(isTyping) return;

        if(e.shiftKey && e.code === 'KeyC') {
            panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
            renderList();
            return;
        }

        if(e.shiftKey && e.code === 'KeyD') {
            e.preventDefault();
            collectCurrentPage();
            return;
        }
    });

})();