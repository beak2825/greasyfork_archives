// ==UserScript==
// @name         Amazon SU Custom Course List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  客製化課程推薦導航
// @author       SS team
// @match        https://sellercentral.amazon.com/learn/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/544801/Amazon%20SU%20Custom%20Course%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/544801/Amazon%20SU%20Custom%20Course%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw4xDPYmN3nZuSJBSe6IxZqapvt7lUSoI7MsvENNcN_o6ipLNjzRea8xr908kwBmDOjBA/exec";
    const ICONS = { 'thumb': '👍', 'fire': '🔥', 'star': '⭐', 'new': '🆕', 'video': '📺', 'text': '📄', 'case': '💡', 'guide': '🗺️', 'webinar': '💻', 'ads': '📈', 'brand': '🛡️', 'listing': '📝', 'fba': '📦', 'data': '📊', 'policy': '⚖️', 'beginner': '🔰', 'advanced': '🚀', 'alert': '⚠️', 'update': '🔄' };
    const SOURCE_TYPES = { 'SU': '賣家大學', 'YT': 'YouTube', 'SS': '線下課程/活動' };
    const SOURCE_COLORS = { 'SU': '#4285F4', 'YT': '#FF0000', 'SS': '#6c757d' };


    let allCourses = [];
    let activeSourceFilters = new Set(Object.keys(SOURCE_TYPES));
    let activeTagFilters = new Set(['全部']);

    function createUI() {
        const container = document.createElement('div');
        container.id = 'custom-course-container';
        const toggleButton = document.createElement('div');
        toggleButton.id = 'custom-course-toggle-button';
        toggleButton.innerText = '我的課程';
        document.body.appendChild(toggleButton);
        container.innerHTML = ` <div id="custom-course-left-panel"> <div class="panel-section"> <h4>By Source</h4> <div id="source-filter-container"></div> </div> <div class="panel-section"> <h4>By Tag</h4> <div id="tag-filter-container"></div> </div> </div> <div id="custom-course-right-panel"> <div id="course-list-header"> <h3>學習資源</h3> <span id="custom-course-close-btn">×</span> </div> <div id="course-list">正在載入課程資料...</div> </div> `;
        document.body.appendChild(container);
        toggleButton.addEventListener('click', () => { container.classList.add('visible'); toggleButton.classList.add('hidden'); });
        document.getElementById('custom-course-close-btn').addEventListener('click', () => { container.classList.remove('visible'); toggleButton.classList.remove('hidden'); });
    }

    function fetchData() {
        if (!WEB_APP_URL || WEB_APP_URL.includes("在這裡貼上您的網頁應用程式網址")) { document.getElementById('course-list').innerHTML = '<div class="course-item-error">不明錯誤103，請聯繫您的帳戶經理。</div>'; return; }
        GM_xmlhttpRequest({
            method: "GET", url: WEB_APP_URL,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) { allCourses = result.data; initializeFiltersAndRender(); } else { throw new Error(result.error || '未知的 API 錯誤'); }
                } catch (e) { console.error("解析課程數據時出錯:", e); document.getElementById('course-list').innerHTML = `<div class="course-item-error">載入課程失敗: ${e.message}。</div>`; }
            },
            onerror: function(error) { console.error("獲取課程數據時出錯:", error); document.getElementById('course-list').innerHTML = '<div class="course-item-error">無法連線至課程 API。</div>'; }
        });
    }

    function initializeFiltersAndRender() {
        renderSourceFilters();
        renderTagFilters();
        renderCourses();
    }

    function renderSourceFilters() {
        const sourceContainer = document.getElementById('source-filter-container');
        sourceContainer.innerHTML = '';
        for (const typeKey in SOURCE_TYPES) {
            const button = document.createElement('button');
            button.className = 'source-filter-btn active';
            button.dataset.type = typeKey;
            button.textContent = SOURCE_TYPES[typeKey];
            sourceContainer.appendChild(button);
        }
        sourceContainer.addEventListener('click', e => {
            const target = e.target;
            if (target.classList.contains('source-filter-btn')) {
                target.classList.toggle('active');
                const type = target.dataset.type;
                if (target.classList.contains('active')) { activeSourceFilters.add(type); } else { activeSourceFilters.delete(type); }
                renderCourses();
            }
        });
    }

    function renderTagFilters() {
        const tagContainer = document.getElementById('tag-filter-container');
        const tagCounts = new Map();
        allCourses.forEach(course => { course.tags.forEach(tag => { tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1); }); });
        const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        const allTagNames = ['全部', ...sortedTags];
        tagContainer.innerHTML = '';
        allTagNames.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'tag-filter-btn';
            const count = tag === '全部' ? allCourses.length : tagCounts.get(tag);
            button.textContent = `# ${tag} (${count})`;
            button.dataset.tag = tag;
            if (activeTagFilters.has(tag)) { button.classList.add('active'); }
            button.addEventListener('click', () => {
                const clickedTag = button.dataset.tag;
                if (clickedTag === '全部') {
                    activeTagFilters.clear();
                    activeTagFilters.add('全部');
                } else {
                    activeTagFilters.delete('全部');
                    if (activeTagFilters.has(clickedTag)) { activeTagFilters.delete(clickedTag); } else { activeTagFilters.add(clickedTag); }
                }
                if (activeTagFilters.size === 0) { activeTagFilters.add('全部'); }
                tagContainer.querySelectorAll('.tag-filter-btn').forEach(btn => {
                    if (activeTagFilters.has(btn.dataset.tag)) { btn.classList.add('active'); } else { btn.classList.remove('active'); }
                });
                renderCourses();
            });
            tagContainer.appendChild(button);
        });
    }

    function renderCourses() {
        const listContainer = document.getElementById('course-list');
        listContainer.innerHTML = '';
        const filteredBySource = allCourses.filter(course => activeSourceFilters.has(course.type));
        const finalFiltered = activeTagFilters.has('全部') ? filteredBySource : filteredBySource.filter(course => { return Array.from(activeTagFilters).every(filterTag => course.tags.includes(filterTag)); });

        if (finalFiltered.length === 0) { listContainer.innerHTML = '<div class="course-item-empty">在此篩選條件下沒有找到課程。</div>'; return; }
        finalFiltered.forEach(course => {
            const item = document.createElement('div');
            item.className = 'course-item';
            item.style.setProperty('--source-color', SOURCE_COLORS[course.type] || '#ccc');
            const iconSpan = course.icon && ICONS[course.icon] ? `<span class="course-icon">${ICONS[course.icon]}</span>` : '';
            item.innerHTML = ` ${iconSpan} <div class="course-name">${course.name}</div> <div class="course-tags">${course.tags.map(t => `#${t}`).join(' ') || '無標籤'}</div> `;
            listContainer.appendChild(item);
            item.addEventListener('click', (e) => handleCourseClick(e, course));
        });
    }

    function handleCourseClick(e, course) {
        if (!course) return;
        if (course.type === 'SU') { GM_openInTab(course.url, { active: false, insert: true }); }
        else if (course.type === 'YT') {
            const videoId = extractYouTubeId(course.url);
            if (videoId) { showYoutubePlayer(videoId); } else { alert('無法解析 YouTube 影片 ID'); GM_openInTab(course.url, { active: true, insert: true }); }
        } else if (course.type === 'SS') { GM_openInTab(course.url, { active: true, insert: true }); }
    }

    function createYoutubeModal() {
        if (document.getElementById('yt-player-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'yt-player-modal';
        modal.innerHTML = ` <div id="yt-player-overlay"></div> <div id="yt-player-container"> <span id="yt-player-close">×</span> <iframe id="yt-player-iframe" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div> `;
        document.body.appendChild(modal);
        document.getElementById('yt-player-overlay').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('yt-player-close').addEventListener('click', () => modal.style.display = 'none');
    }

    function showYoutubePlayer(videoId) {
        const modal = document.getElementById('yt-player-modal');
        const iframe = document.getElementById('yt-player-iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.style.display = 'flex';
    }

    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function addGlobalStyle() {
        GM_addStyle(`
            #custom-course-toggle-button { position: fixed; bottom: 30px; right: 30px; z-index: 10001; background-color: #ff9900; color: white; padding: 12px 18px; border-radius: 25px; cursor: pointer; font-size: 16px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: opacity 0.3s ease-in-out, transform 0.2s ease-in-out; }
            #custom-course-toggle-button:hover { transform: scale(1.05); }
            #custom-course-toggle-button.hidden { opacity: 0; pointer-events: none; }
            #custom-course-container { position: fixed; top: 0; right: 0; width: 80vw; max-width: 1000px; height: 100vh; background-color: #f7f7f7; z-index: 10000; box-shadow: -5px 0 15px rgba(0,0,0,0.2); display: flex; transform: translateX(100%); transition: transform 0.3s ease-in-out; }
            #custom-course-container.visible { transform: translateX(0); }
            #custom-course-left-panel { width: 250px; background-color: #e9ecef; padding: 20px; border-right: 1px solid #ddd; overflow-y: auto; flex-shrink: 0; }
            .panel-section { margin-bottom: 25px; }
            .panel-section h4 { margin: 0 0 15px 0; font-size: 16px; color: #333; border-bottom: 2px solid #ff9900; padding-bottom: 8px; }
            #source-filter-container { display: flex; flex-direction: column; gap: 10px; }
            .source-filter-btn { width: 100%; padding: 10px; font-size: 14px; font-weight: 500; text-align: center; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s ease; }
            .source-filter-btn:not(.active) { background-color: #6c757d; color: white; }
            .source-filter-btn:not(.active):hover { background-color: #5a6268; }
            .source-filter-btn.active { background-color: #ff9900; color: white; }
            #tag-filter-container { display: flex; flex-direction: column; gap: 8px; }
            .tag-filter-btn { width: 100%; text-align: left; background-color: #fff; border: 1px solid #ccc; border-radius: 6px; padding: 8px 12px; font-size: 13px; cursor: pointer; color: #333; transition: all 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .tag-filter-btn:hover { background-color: #f0f0f0; border-color: #999; }
            .tag-filter-btn.active { background-color: #ff9900; color: white; border-color: #e68a00; font-weight: bold; }
            #custom-course-right-panel { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
            #course-list-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background-color: #fff; border-bottom: 1px solid #ddd; flex-shrink: 0; }
            #course-list { padding: 20px; overflow-y: auto; flex-grow: 1; }
            .course-item { position: relative; background-color: #fff; border-radius: 8px; padding: 15px 15px 15px 25px; margin-bottom: 25px; cursor: pointer; transition: box-shadow 0.2s; border-left: 5px solid var(--source-color, #ccc); }
            .course-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .course-name { font-size: 16px; font-weight: 500; color: #0066c0; margin-bottom: 8px; }
            .course-tags { font-size: 12px; color: #555; }
            .course-item-empty, .course-item-error { text-align: center; color: #888; padding: 40px; font-style: italic; }
            .course-icon { position: absolute; top: 0; left: 0; font-size: 32px; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.25); transform: translate(-50%, -50%); z-index: 1; }
            #yt-player-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10002; display: none; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; }
            #yt-player-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); }
            #yt-player-container { position: relative; z-index: 1; width: 100%; max-width: 1200px; background: black; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
            #yt-player-iframe { width: 100%; aspect-ratio: 16 / 9; height: auto; display: block; border: none; border-radius: 8px; }
            #yt-player-close { position: absolute; top: -40px; right: 0; color: white; font-size: 40px; font-weight: bold; cursor: pointer; text-shadow: 0 0 5px black; }
        `);
    }

    function init() {
        addGlobalStyle();
        createUI();
        createYoutubeModal();
        fetchData();
    }

    init();
})();